import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { COOKING_LEVELS } from '../../core/models/cooking-level.model';
import { Liga } from '../../core/models/user-stats.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  private auth    = inject(AuthService);
  private profile = inject(ProfileService);

  readonly user  = this.auth.currentUser;
  readonly stats = this.profile.stats;

  ngOnInit(): void {
    const uid = this.user()?.uid;
    if (uid) this.profile.loadStats(uid);
  }

  // Descripción del nivel de cocina actual
  get levelLabel(): string {
    const level = this.user()?.cookingLevel;
    return COOKING_LEVELS.find((l) => l.value === level)?.label ?? '—';
  }

  get levelIcon(): string {
    const level = this.user()?.cookingLevel;
    return COOKING_LEVELS.find((l) => l.value === level)?.icon ?? '🍽️';
  }

  // Fecha formateada de ingreso
  get fechaIngreso(): string {
    const raw = this.user()?.createdAt;
    if (!raw) return '—';
    return new Date(raw).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Iniciales para el avatar por defecto
  get initials(): string {
    const name = this.user()?.displayName ?? this.user()?.email ?? '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  // Icono y color por liga
  ligaConfig(liga: Liga): { icon: string; color: string } {
    const map: Record<Liga, { icon: string; color: string }> = {
      Bronce:   { icon: '🥉', color: '#cd7f32' },
      Plata:    { icon: '🥈', color: '#a8a9ad' },
      Oro:      { icon: '🥇', color: '#f5c518' },
      Platino:  { icon: '💠', color: '#00c8ff' },
      Diamante: { icon: '💎', color: '#b9f2ff' },
    };
    return map[liga] ?? map['Bronce'];
  }

  // XP hacia el siguiente nivel de liga
  get xpProgress(): number {
    const xp = this.stats()?.xpTotal ?? 0;
    const thresholds = [0, 500, 1500, 3000, 5000];
    const next = thresholds.find((t) => t > xp) ?? 5000;
    const prev = thresholds[thresholds.indexOf(next) - 1] ?? 0;
    return Math.round(((xp - prev) / (next - prev)) * 100);
  }

  get xpNextLiga(): number {
    const xp = this.stats()?.xpTotal ?? 0;
    const thresholds = [500, 1500, 3000, 5000];
    return thresholds.find((t) => t > xp) ?? 5000;
  }
}
