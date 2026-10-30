import { Injectable, signal } from '@angular/core';
import { UserStats, calcularLiga, defaultStats } from '../models/user-stats.model';

const STATS_KEY = 'nexus_stats';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private _stats = signal<UserStats | null>(null);
  readonly stats = this._stats.asReadonly();

  // Carga o crea las estadísticas de un usuario
  loadStats(uid: string): void {
    const all = this.getAllStats();
    const found = all.find((s) => s.uid === uid);

    if (found) {
      this._stats.set(found);
    } else {
      const fresh = defaultStats(uid);
      all.push(fresh);
      localStorage.setItem(STATS_KEY, JSON.stringify(all));
      this._stats.set(fresh);
    }
  }

  // Actualiza el XP y recalcula la liga
  addXP(uid: string, amount: number): void {
    this.updateStats(uid, (s) => {
      const newXP = s.xpTotal + amount;
      return { ...s, xpTotal: newXP, liga: calcularLiga(newXP) };
    });
  }

  // Incrementa recetas completadas
  completarReceta(uid: string): void {
    this.updateStats(uid, (s) => ({
      ...s,
      recetasCompletadas: s.recetasCompletadas + 1,
    }));
  }

  // Actualiza la racha
  actualizarRacha(uid: string, dias: number): void {
    this.updateStats(uid, (s) => ({ ...s, racha: dias }));
  }

  // Limpia el estado al cerrar sesión
  clearStats(): void {
    this._stats.set(null);
  }

  // ── Helpers privados ─────────────────────────────────────────────────────────
  private updateStats(uid: string, fn: (s: UserStats) => UserStats): void {
    const all = this.getAllStats();
    const idx = all.findIndex((s) => s.uid === uid);

    if (idx === -1) return;

    const updated = fn(all[idx]);
    all[idx] = updated;
    localStorage.setItem(STATS_KEY, JSON.stringify(all));
    this._stats.set(updated);
  }

  private getAllStats(): UserStats[] {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : [];
  }
}
