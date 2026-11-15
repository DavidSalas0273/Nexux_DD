import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RetosService, JugadorRanking } from '../../../../services/retos.service';

type TabRanking = 'diario' | 'semanal';

@Component({
  selector: 'app-ranking',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class Ranking implements OnInit {
  private retosService = inject(RetosService);

  tab = signal<TabRanking>('diario');
  jugadoresDiario = signal<JugadorRanking[]>([]);
  jugadoresSemanal = signal<JugadorRanking[]>([]);
  cargando = signal(true);

  get jugadores(): JugadorRanking[] {
    return this.tab() === 'diario' ? this.jugadoresDiario() : this.jugadoresSemanal();
  }

  get liga(): string {
    const me = this.jugadores.find(j => j.esUsuario);
    if (!me) return 'Bronce';
    if (me.posicion <= 3) return 'Oro';
    if (me.posicion <= 6) return 'Plata';
    return 'Bronce';
  }

  ngOnInit(): void {
    this.cargarAmbos();
  }

  cargarAmbos(): void {
    this.cargando.set(true);
    let pendientes = 2;
    const done = () => { if (--pendientes === 0) this.cargando.set(false); };

    this.retosService.getRankingDiario().subscribe({
      next: (data) => { this.jugadoresDiario.set(data); done(); },
      error: () => done(),
    });
    this.retosService.getRankingSemanal().subscribe({
      next: (data) => { this.jugadoresSemanal.set(data); done(); },
      error: () => done(),
    });
  }

  cambiarTab(t: TabRanking): void {
    this.tab.set(t);
  }

  getMedalla(pos: number): string {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return '';
  }

  maxXp(): number {
    return this.jugadores[0]?.xp || 1;
  }

  posicionUsuario(): number {
    return this.jugadores.find(j => j.esUsuario)?.posicion ?? 0;
  }
}
