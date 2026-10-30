import { Injectable, computed, inject } from '@angular/core';
import { BADGES, BadgeStatus, BadgeConditionInput } from '../models/badge.model';
import { ProfileService } from './profile.service';

@Injectable({ providedIn: 'root' })
export class BadgeService {
  private profile = inject(ProfileService);

  // Evalúa todas las insignias contra las stats actuales
  readonly allBadges = computed<BadgeStatus[]>(() => {
    const stats = this.profile.stats();
    const input: BadgeConditionInput = {
      racha:               stats?.racha               ?? 0,
      recetasCompletadas:  stats?.recetasCompletadas  ?? 0,
      xpTotal:             stats?.xpTotal             ?? 0,
    };

    return BADGES.map((badge) => ({
      ...badge,
      obtenida: badge.condicion(input),
    }));
  });

  readonly obtenidas = computed(() =>
    this.allBadges().filter((b) => b.obtenida)
  );

  readonly pendientes = computed(() =>
    this.allBadges().filter((b) => !b.obtenida)
  );

  readonly totalObtenidas = computed(() => this.obtenidas().length);
  readonly totalBadges    = computed(() => BADGES.length);
}
