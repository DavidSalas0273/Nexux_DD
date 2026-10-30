import { Component, inject } from '@angular/core';
import { BadgeService } from '../../../core/services/badge.service';
import { BadgeCategory } from '../../../core/models/badge.model';

@Component({
  selector: 'app-badges',
  standalone: true,
  templateUrl: './badges.html',
  styleUrl: './badges.css',
})
export class BadgesComponent {
  private badgeService = inject(BadgeService);

  readonly obtenidas    = this.badgeService.obtenidas;
  readonly pendientes   = this.badgeService.pendientes;
  readonly total        = this.badgeService.totalBadges;
  readonly totalObten   = this.badgeService.totalObtenidas;

  // Etiqueta legible por categoría
  categoriaLabel(cat: BadgeCategory): string {
    const map: Record<BadgeCategory, string> = {
      racha:    '🔥 Racha',
      recetas:  '🍽️ Recetas',
      tecnica:  '🔪 Técnica',
      especial: '🎉 Especial',
    };
    return map[cat];
  }
}
