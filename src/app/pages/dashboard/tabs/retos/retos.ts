import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetosService, Reto } from '../../../../services/retos.service';

@Component({
  selector: 'app-retos',
  imports: [CommonModule],
  templateUrl: './retos.html',
  styleUrl: './retos.css',
})
export class Retos implements OnInit {
  private retosService = inject(RetosService);

  retosHoy    = signal<Reto[]>([]);
  retosSemana = signal<Reto[]>([]);
  xpTotal     = signal<number>(0);
  diamantes   = signal<number>(0);
  cargando    = signal(true);
  mensajeXP   = signal<string | null>(null);
  completando = signal<number | null>(null);

  ngOnInit(): void {
    this.cargarRetos();
    this.cargarDiamantes();
  }

  cargarRetos(): void {
    this.cargando.set(true);
    this.retosService.getRetos().subscribe({
      next: (data) => {
        this.retosHoy.set(data.diarios);
        this.retosSemana.set(data.semanales);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  cargarDiamantes(): void {
    this.retosService.getMisDiamantes().subscribe({
      next: (res) => this.diamantes.set(res.diamantes),
      error: () => {},
    });
  }

  completar(reto: Reto): void {
    if (reto.completado || this.completando() !== null) return;
    this.completando.set(reto.id);

    this.retosService.completarReto(reto.id).subscribe({
      next: (res) => {
        this.xpTotal.set(res.xpTotal);
        this.mostrarMensaje(`+${res.xpGanado} XP ganados 🎉`);
        this.cargarRetos();
        this.completando.set(null);
      },
      error: (err) => {
        this.mostrarMensaje(err.error?.error ?? 'Error al completar el reto');
        this.completando.set(null);
      },
    });
  }

  private mostrarMensaje(texto: string): void {
    this.mensajeXP.set(texto);
    setTimeout(() => this.mensajeXP.set(null), 3000);
  }

  xpDiarioCompletado():  number { return this.retosHoy().filter(r => r.completado).reduce((s, r) => s + r.xp, 0); }
  xpDiarioTotal():       number { return this.retosHoy().reduce((s, r) => s + r.xp, 0); }
  xpSemanalCompletado(): number { return this.retosSemana().filter(r => r.completado).reduce((s, r) => s + r.xp, 0); }
  xpSemanalTotal():      number { return this.retosSemana().reduce((s, r) => s + r.xp, 0); }

  etiquetaCategoria(cat: string): string {
    const map: Record<string, string> = {
      fundamentos: '🔪 Fundamentos',
      salsas:      '🍲 Salsas madre',
      proteinas:   '🥩 Proteínas',
      general:     '',
    };
    return map[cat] ?? '';
  }
}
