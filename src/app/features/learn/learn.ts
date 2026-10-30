import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LearningService } from '../../core/services/learning.service';
import { ProfileService } from '../../core/services/profile.service';
import { DifficultyService } from '../../core/services/difficulty.service';
import { DifficultySelectorComponent } from './difficulty-selector/difficulty-selector';
import {
  LearningUnit,
  LearningNode,
  NodeStatus,
  getRutaByLevel,
} from '../../core/models/learning-path.model';
import { CookingLevel } from '../../core/models/cooking-level.model';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [RouterLink, DifficultySelectorComponent],
  templateUrl: './learn.html',
  styleUrl: './learn.css',
})
export class LearnComponent implements OnInit {
  private auth      = inject(AuthService);
  private learning  = inject(LearningService);
  private profile   = inject(ProfileService);
  readonly difficulty = inject(DifficultyService);

  readonly user  = this.auth.currentUser;

  // Las unidades vienen del servicio (reactivas con progreso persistido)
  readonly units = this.learning.units;

  // Nodo recién completado para animación de feedback
  readonly lastCompleted = this.learning.lastCompleted;

  // Unidad expandida
  expandedUnit = signal<string | null>(null);

  // Toast de XP ganado
  xpToast = signal<number | null>(null);

  ngOnInit(): void {
    const level = (this.user()?.cookingLevel ?? 'principiante') as CookingLevel;
    const uid   = this.user()?.uid;

    // Cargar stats del perfil
    if (uid) this.profile.loadStats(uid);

    // Cargar ruta base y aplicar progreso guardado
    const base = getRutaByLevel(level);
    this.learning.loadProgress(base);

    // Expandir la unidad con el nodo activo
    const activeUnit = this.units().find((u) =>
      u.nodos.some((n) => n.status === 'activa')
    ) ?? this.units()[0];

    if (activeUnit) this.expandedUnit.set(activeUnit.id);
  }

  toggleUnit(uid: string): void {
    this.expandedUnit.set(this.expandedUnit() === uid ? null : uid);
  }

  isExpanded(uid: string): boolean {
    return this.expandedUnit() === uid;
  }

  // ── Completar nodo ───────────────────────────────────────────────────────────
  completarNodo(node: LearningNode, unitId: string): void {
    if (node.status !== 'activa') return;

    this.learning.completarNodo(node.id);

    // Mostrar toast con XP final (ya con multiplicador aplicado)
    const xpFinal = this.learning.lastXP();
    this.xpToast.set(xpFinal);
    setTimeout(() => this.xpToast.set(null), 2000);

    // Auto-expandir la unidad donde quedó el nuevo nodo activo
    const nextActive = this.units().find((u) =>
      u.nodos.some((n) => n.status === 'activa')
    );
    if (nextActive) this.expandedUnit.set(nextActive.id);
  }

  // ── Helpers de presentación ──────────────────────────────────────────────────
  completadas(unit: LearningUnit): number {
    return unit.nodos.filter((n) => n.status === 'completada').length;
  }

  progreso(unit: LearningUnit): number {
    return Math.round((this.completadas(unit) / unit.nodos.length) * 100);
  }

  nodeIcon(node: LearningNode): string {
    if (node.status === 'completada') return '✅';
    if (node.status === 'bloqueada')  return '🔒';
    return node.tipo === 'examen' ? '📝' : '📖';
  }

  tipoLabel(node: LearningNode): string {
    return node.tipo === 'examen' ? 'Examen' : 'Lección';
  }

  nodeClass(status: NodeStatus): string {
    return `node--${status}`;
  }

  xpUnidad(unit: LearningUnit): number {
    return unit.nodos.reduce((sum, n) => sum + n.xpRecompensa, 0);
  }

  isJustCompleted(nodeId: string): boolean {
    return this.lastCompleted() === nodeId;
  }

  get nivelLabel(): string {
    return this.user()?.cookingLevel ?? 'principiante';
  }

  get totalXP(): number {
    return this.profile.stats()?.xpTotal ?? 0;
  }

  // XP de un nodo con el multiplicador de dificultad aplicado
  xpConDificultad(base: number): number {
    return this.difficulty.calculateXP(base);
  }
}
