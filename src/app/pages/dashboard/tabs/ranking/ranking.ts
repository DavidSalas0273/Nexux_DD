import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RetosService, JugadorRanking } from '../../../../services/retos.service';
import { Icono } from '../../../aprender/icono';

type Periodo = 'diario' | 'semanal';

interface Liga {
  nombre: string;
  clase: string;
  desde: number;
}

/** Ligas según el XP total acumulado. */
const LIGAS: Liga[] = [
  { nombre: 'Bronce', clase: 'bronce', desde: 0 },
  { nombre: 'Plata', clase: 'plata', desde: 150 },
  { nombre: 'Oro', clase: 'oro', desde: 400 },
  { nombre: 'Esmeralda', clase: 'esmeralda', desde: 900 },
];

@Component({
  selector: 'app-ranking',
  imports: [Icono],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class Ranking implements OnInit {
  private retosService = inject(RetosService);

  periodo = signal<Periodo>('semanal');
  diario = signal<JugadorRanking[]>([]);
  semanal = signal<JugadorRanking[]>([]);
  cargando = signal(true);
  error = signal(false);

  jugadores = computed(() => (this.periodo() === 'diario' ? this.diario() : this.semanal()));
  yo = computed(() => this.jugadores().find((j) => j.esUsuario) ?? null);
  hayXp = computed(() => this.jugadores().some((j) => j.xp > 0));

  /** XP total del usuario (es el mismo en ambos periodos). */
  private xpTotal = computed(() => (this.semanal().find((j) => j.esUsuario) ?? this.diario().find((j) => j.esUsuario))?.xpTotal ?? 0);

  liga = computed(() => [...LIGAS].reverse().find((l) => this.xpTotal() >= l.desde) ?? LIGAS[0]);

  siguienteLiga = computed(() => LIGAS.find((l) => l.desde > this.xpTotal()) ?? null);

  progresoLiga = computed(() => {
    const actual = this.liga();
    const siguiente = this.siguienteLiga();
    if (!siguiente) return 100;
    return ((this.xpTotal() - actual.desde) / (siguiente.desde - actual.desde)) * 100;
  });

  faltaXp = computed(() => {
    const siguiente = this.siguienteLiga();
    return siguiente ? siguiente.desde - this.xpTotal() : 0;
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    let pendientes = 2;
    const listo = () => {
      if (--pendientes === 0) this.cargando.set(false);
    };
    const fallo = () => {
      this.error.set(true);
      listo();
    };

    this.retosService.getRankingDiario().subscribe({
      next: (data) => { this.diario.set(data); listo(); },
      error: fallo,
    });
    this.retosService.getRankingSemanal().subscribe({
      next: (data) => { this.semanal.set(data); listo(); },
      error: fallo,
    });
  }

  fotoUrl(j: JugadorRanking): string | null {
    return j.foto ? `http://localhost:3000${j.foto}` : null;
  }

  /** Color de avatar estable por usuario. */
  colorAvatar(id: number): string {
    const colores = ['#ce82ff', '#1cb0f6', '#ff9600', '#58cc02', '#ff4b4b', '#2b70c9'];
    return colores[id % colores.length];
  }
}
