import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RetosService, Reto } from '../../../../services/retos.service';
import { Icono } from '../../../aprender/icono';
import { Juego } from './juego/juego';
import { CONFIG_JUEGOS } from './juegos.data';

@Component({
  selector: 'app-retos',
  imports: [Icono, Juego],
  templateUrl: './retos.html',
  styleUrl: './retos.css',
})
export class Retos implements OnInit {
  private retosService = inject(RetosService);

  retosHoy = signal<Reto[]>([]);
  retosSemana = signal<Reto[]>([]);
  xpTotal = signal(0);
  cargando = signal(true);
  error = signal(false);

  /** Reto que se está jugando (abre el minijuego a pantalla completa). */
  jugando = signal<Reto | null>(null);

  hechosHoy = computed(() => this.retosHoy().filter((r) => r.completado).length);
  hechosSemana = computed(() => this.retosSemana().filter((r) => r.completado).length);

  ngOnInit(): void {
    this.cargarRetos();
  }

  cargarRetos(): void {
    this.error.set(false);
    this.retosService.getRetos().subscribe({
      next: (data) => {
        // Solo se muestran los retos que tienen un juego asignado
        this.retosHoy.set(data.diarios.filter((r) => r.juego));
        this.retosSemana.set(data.semanales.filter((r) => r.juego));
        this.xpTotal.set(data.xpTotal ?? 0);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set(true);
      },
    });
  }

  jugar(reto: Reto): void {
    this.jugando.set(reto);
  }

  cerrarJuego(huboCambio: boolean): void {
    this.jugando.set(null);
    if (huboCambio) this.cargarRetos();
  }

  resumen(reto: Reto): string {
    return reto.juego ? CONFIG_JUEGOS[reto.juego].resumen : '';
  }
}
