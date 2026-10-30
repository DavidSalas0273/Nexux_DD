import { Injectable, inject, signal } from '@angular/core';
import { LearningUnit, LearningNode, NodeStatus } from '../models/learning-path.model';
import { ProfileService } from './profile.service';
import { AuthService } from './auth.service';
import { DifficultyService } from './difficulty.service';

// Clave de progreso: nexus_progress_<uid>_<level>
const progressKey = (uid: string, level: string) =>
  `nexus_progress_${uid}_${level}`;

@Injectable({ providedIn: 'root' })
export class LearningService {
  private profile    = inject(ProfileService);
  private auth       = inject(AuthService);
  private difficulty = inject(DifficultyService);

  // Unidades con progreso aplicado
  private _units = signal<LearningUnit[]>([]);
  readonly units = this._units.asReadonly();

  // Nodo que se completó recientemente (para feedback visual)
  readonly lastCompleted = signal<string | null>(null);

  // XP final otorgado en el último nodo completado
  readonly lastXP = signal<number>(0);

  // ── Cargar progreso guardado ─────────────────────────────────────────────────
  loadProgress(baseUnits: LearningUnit[]): void {
    const uid   = this.auth.currentUser()?.uid;
    const level = this.auth.currentUser()?.cookingLevel ?? 'principiante';
    if (!uid) { this._units.set(baseUnits); return; }

    const saved = this.getSavedProgress(uid, level);

    if (!saved) {
      // Sin progreso guardado: usar el estado base del catálogo
      this._units.set(this.deepClone(baseUnits));
      return;
    }

    // Aplicar el progreso guardado sobre los datos base
    const merged = baseUnits.map((unit) => ({
      ...unit,
      nodos: unit.nodos.map((node) => ({
        ...node,
        status: (saved[node.id] ?? node.status) as NodeStatus,
      })),
    }));

    this._units.set(merged);
  }

  // ── Completar un nodo y desbloquear el siguiente ─────────────────────────────
  completarNodo(nodeId: string): void {
    const uid   = this.auth.currentUser()?.uid;
    const level = this.auth.currentUser()?.cookingLevel ?? 'principiante';
    if (!uid) return;

    const units = this.deepClone(this._units());

    // Localizar el nodo en la estructura plana
    let completedUnitIdx = -1;
    let completedNodeIdx = -1;

    for (let ui = 0; ui < units.length; ui++) {
      const ni = units[ui].nodos.findIndex((n) => n.id === nodeId);
      if (ni !== -1) {
        completedUnitIdx = ui;
        completedNodeIdx = ni;
        break;
      }
    }

    if (completedUnitIdx === -1) return;

    const unit = units[completedUnitIdx];
    const node = unit.nodos[completedNodeIdx];

    // Solo se puede completar si está activa
    if (node.status !== 'activa') return;

    // 1. Marcar el nodo como completado
    node.status = 'completada';
    this.lastCompleted.set(nodeId);

    // 2. Desbloquear el siguiente nodo de forma secuencial
    const nextNodeIdx = completedNodeIdx + 1;

    if (nextNodeIdx < unit.nodos.length) {
      // Hay un siguiente nodo en la misma unidad
      unit.nodos[nextNodeIdx].status = 'activa';
    } else {
      // Era el último nodo de la unidad → desbloquear primer nodo de la siguiente
      const nextUnitIdx = completedUnitIdx + 1;
      if (nextUnitIdx < units.length) {
        units[nextUnitIdx].nodos[0].status = 'activa';
      }
    }

    this._units.set(units);

    // 3. Persistir progreso
    this.saveProgress(uid, level, units);

    // 4. Sumar XP al perfil (aplicando multiplicador de dificultad)
    const xpFinal = this.difficulty.calculateXP(node.xpRecompensa);
    this.profile.addXP(uid, xpFinal);

    // Guardar el XP final para que el componente lo muestre en el toast
    this.lastXP.set(xpFinal);

    // 5. Incrementar recetas si es una lección (no examen)
    if (node.tipo === 'leccion') {
      this.profile.completarReceta(uid);
    }
  }

  // ── Resetear progreso (útil al cambiar de nivel) ─────────────────────────────
  resetProgress(uid: string, level: string): void {
    localStorage.removeItem(progressKey(uid, level));
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  private saveProgress(
    uid: string,
    level: string,
    units: LearningUnit[]
  ): void {
    // Guardar solo un mapa nodeId → status para ahorrar espacio
    const map: Record<string, NodeStatus> = {};
    units.forEach((u) => u.nodos.forEach((n) => (map[n.id] = n.status)));
    localStorage.setItem(progressKey(uid, level), JSON.stringify(map));
  }

  private getSavedProgress(
    uid: string,
    level: string
  ): Record<string, NodeStatus> | null {
    const raw = localStorage.getItem(progressKey(uid, level));
    return raw ? JSON.parse(raw) : null;
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
