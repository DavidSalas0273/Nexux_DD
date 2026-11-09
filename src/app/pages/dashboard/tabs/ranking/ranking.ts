import { Component, inject, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

interface Jugador {
  posicion: number;
  nombre: string;
  xp: number;
  inicial: string;
  esUsuario?: boolean;
}

@Component({
  selector: 'app-ranking',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class Ranking {
  private authService = inject(AuthService);
  user = computed(() => this.authService.currentUser());

  liga = 'Plata';

  jugadores: Jugador[] = [
    { posicion: 1, nombre: 'Chef Marco', xp: 4200, inicial: 'M' },
    { posicion: 2, nombre: 'Ana García', xp: 3850, inicial: 'A' },
    { posicion: 3, nombre: 'Luis Torres', xp: 3100, inicial: 'L' },
    { posicion: 4, nombre: 'Sara Ruiz', xp: 2740, inicial: 'S' },
    { posicion: 5, nombre: 'Pedro M.', xp: 2300, inicial: 'P' },
    { posicion: 6, nombre: 'Lucía H.', xp: 1840, inicial: 'L', esUsuario: true },
    { posicion: 7, nombre: 'Carla V.', xp: 1500, inicial: 'C' },
    { posicion: 8, nombre: 'Diego R.', xp: 1200, inicial: 'D' },
    { posicion: 9, nombre: 'Marta C.', xp: 900, inicial: 'M' },
    { posicion: 10, nombre: 'Tomás B.', xp: 650, inicial: 'T' },
  ];

  getMedalla(pos: number): string {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return '';
  }
}
