import { Injectable, signal, computed } from '@angular/core';
import {
  DifficultyMode,
  DifficultyOption,
  DIFFICULTY_OPTIONS,
  DIFFICULTY_KEY,
} from '../models/difficulty.model';

@Injectable({ providedIn: 'root' })
export class DifficultyService {
  private _mode = signal<DifficultyMode>(this.loadSaved());

  readonly mode    = this._mode.asReadonly();
  readonly options = DIFFICULTY_OPTIONS;

  // Opción completa del modo actual
  readonly current = computed<DifficultyOption>(
    () => DIFFICULTY_OPTIONS.find((o) => o.value === this._mode()) ?? DIFFICULTY_OPTIONS[1]
  );

  // Multiplicador de XP activo
  readonly xpMultiplier = computed(() => this.current().xpMultiplier);

  setMode(mode: DifficultyMode): void {
    this._mode.set(mode);
    localStorage.setItem(DIFFICULTY_KEY, mode);
  }

  // XP final aplicando el multiplicador (redondeado)
  calculateXP(base: number): number {
    return Math.round(base * this.xpMultiplier());
  }

  private loadSaved(): DifficultyMode {
    const saved = localStorage.getItem(DIFFICULTY_KEY) as DifficultyMode | null;
    return saved ?? 'normal';
  }
}
