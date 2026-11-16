import { Component, OnDestroy, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { Icono } from '../../../../aprender/icono';
import { Reto, RetosService } from '../../../../../services/retos.service';
import {
  CONFIG_JUEGOS,
  FRASES_VF,
  PAREJAS,
  PREGUNTAS_RAPIDAS,
  PROCEDIMIENTOS,
  Procedimiento,
  mezclar,
} from '../juegos.data';

/** Pregunta lista para mostrar: opciones ya mezcladas. */
interface PreguntaJuego {
  texto: string;
  opciones: string[];
  correcta: number;
}

interface ParejaJuego {
  id: number;
  termino: string;
  definicion: string;
}

type Modo = 'quiz' | 'vf' | 'parejas' | 'ordenar';
type EstadoXp = 'guardando' | 'ganado' | 'practica' | 'error';

const MINIMO_ACIERTOS = 0.6;

@Component({
  selector: 'app-juego',
  imports: [Icono],
  templateUrl: './juego.html',
  styleUrl: './juego.css',
})
export class Juego implements OnInit, OnDestroy {
  private retosService = inject(RetosService);

  reto = input.required<Reto>();
  /** true si el reto se completó y hay que recargar la lista */
  cerrar = output<boolean>();

  modo = signal<Modo>('quiz');
  segundos = signal(0);
  terminado = signal(false);
  aciertos = signal(0);
  total = signal(0);

  // XP al terminar
  estadoXp = signal<EstadoXp | null>(null);
  xpGanado = signal(0);
  mensajeError = signal('');
  private huboCambio = false;

  // ── Quiz y verdadero/falso ──
  preguntas = signal<PreguntaJuego[]>([]);
  indice = signal(0);
  elegida = signal<number | null>(null);
  private temporizador: ReturnType<typeof setTimeout> | null = null;
  private avance: ReturnType<typeof setTimeout> | null = null;

  preguntaActual = computed(() => this.preguntas()[this.indice()] ?? null);

  // ── Parejas ──
  parejas = signal<ParejaJuego[]>([]);
  columnaIzq = signal<ParejaJuego[]>([]);
  columnaDer = signal<ParejaJuego[]>([]);
  selIzq = signal<number | null>(null);
  selDer = signal<number | null>(null);
  emparejadas = signal<number[]>([]);
  error = signal<{ izq: number; der: number } | null>(null);
  private falladas = new Set<number>();

  // ── Ordenar pasos ──
  rondas = signal<Procedimiento[]>([]);
  ronda = signal(0);
  banco = signal<number[]>([]);
  elegidos = signal<number[]>([]);
  comprobado = signal(false);

  procedimiento = computed(() => this.rondas()[this.ronda()] ?? null);

  progreso = computed(() => {
    if (this.terminado()) return 100;
    switch (this.modo()) {
      case 'quiz':
      case 'vf':
        return (this.indice() / Math.max(this.preguntas().length, 1)) * 100;
      case 'parejas':
        return (this.emparejadas().length / Math.max(this.parejas().length, 1)) * 100;
      case 'ordenar':
        return (this.ronda() / Math.max(this.rondas().length, 1)) * 100;
    }
  });

  aprobado = computed(() => this.total() > 0 && this.aciertos() / this.total() >= MINIMO_ACIERTOS);
  porcentaje = computed(() => (this.total() ? Math.round((this.aciertos() / this.total()) * 100) : 0));

  ngOnInit(): void {
    this.iniciar();
  }

  ngOnDestroy(): void {
    this.limpiarTimers();
  }

  iniciar(): void {
    this.limpiarTimers();
    const juego = this.reto().juego ?? 'relampago';
    const config = CONFIG_JUEGOS[juego];

    this.terminado.set(false);
    this.aciertos.set(0);
    this.total.set(0);
    this.estadoXp.set(null);
    this.segundos.set(config.segundos);

    if (juego === 'relampago' || juego === 'maraton') {
      this.modo.set('quiz');
      this.preguntas.set(
        mezclar(PREGUNTAS_RAPIDAS)
          .slice(0, config.cantidad)
          .map((p) => {
            const orden = mezclar(p.opciones.map((_, i) => i));
            return { texto: p.texto, opciones: orden.map((i) => p.opciones[i]), correcta: orden.indexOf(p.correcta) };
          })
      );
      this.empezarPregunta(0);
    } else if (juego === 'vf') {
      this.modo.set('vf');
      this.preguntas.set(
        mezclar(FRASES_VF)
          .slice(0, config.cantidad)
          .map((f) => ({ texto: f.texto, opciones: ['Falso', 'Verdadero'], correcta: f.verdadera ? 1 : 0 }))
      );
      this.empezarPregunta(0);
    } else if (juego === 'parejas') {
      this.modo.set('parejas');
      const elegidas = mezclar(PAREJAS)
        .slice(0, config.cantidad)
        .map((p, id) => ({ id, ...p }));
      this.parejas.set(elegidas);
      this.columnaIzq.set(mezclar(elegidas));
      this.columnaDer.set(mezclar(elegidas));
      this.selIzq.set(null);
      this.selDer.set(null);
      this.emparejadas.set([]);
      this.error.set(null);
      this.falladas.clear();
    } else {
      this.modo.set('ordenar');
      this.rondas.set(mezclar(PROCEDIMIENTOS).slice(0, config.cantidad));
      this.empezarRonda(0);
    }
  }

  // ════════ QUIZ / VERDADERO O FALSO ════════

  private empezarPregunta(i: number): void {
    this.indice.set(i);
    this.elegida.set(null);
    if (this.segundos() > 0) {
      this.temporizador = setTimeout(() => this.responder(-1), this.segundos() * 1000);
    }
  }

  /** -1 significa que se acabó el tiempo. */
  responder(opcion: number): void {
    const pregunta = this.preguntaActual();
    if (!pregunta || this.elegida() !== null) return;
    this.limpiarTimers();

    this.elegida.set(opcion);
    this.total.update((t) => t + 1);
    if (opcion === pregunta.correcta) this.aciertos.update((a) => a + 1);

    // Avanza solo, para que el juego sea rápido
    this.avance = setTimeout(() => {
      const siguiente = this.indice() + 1;
      if (siguiente >= this.preguntas().length) this.finalizar();
      else this.empezarPregunta(siguiente);
    }, opcion === pregunta.correcta ? 650 : 1300);
  }

  estadoOpcion(i: number): string {
    const elegida = this.elegida();
    const pregunta = this.preguntaActual();
    if (elegida === null || !pregunta) return '';
    if (i === pregunta.correcta) return 'correcta';
    if (i === elegida) return 'incorrecta';
    return 'opacada';
  }

  // ════════ PAREJAS ════════

  elegirIzq(id: number): void {
    if (this.emparejadas().includes(id) || this.error()) return;
    this.selIzq.set(this.selIzq() === id ? null : id);
    this.revisarPareja();
  }

  elegirDer(id: number): void {
    if (this.emparejadas().includes(id) || this.error()) return;
    this.selDer.set(this.selDer() === id ? null : id);
    this.revisarPareja();
  }

  private revisarPareja(): void {
    const izq = this.selIzq();
    const der = this.selDer();
    if (izq === null || der === null) return;

    if (izq === der) {
      this.emparejadas.update((e) => [...e, izq]);
      this.selIzq.set(null);
      this.selDer.set(null);
      if (this.emparejadas().length === this.parejas().length) {
        this.total.set(this.parejas().length);
        this.aciertos.set(this.parejas().length - this.falladas.size);
        this.avance = setTimeout(() => this.finalizar(), 500);
      }
    } else {
      this.falladas.add(izq);
      this.error.set({ izq, der });
      this.avance = setTimeout(() => {
        this.error.set(null);
        this.selIzq.set(null);
        this.selDer.set(null);
      }, 550);
    }
  }

  estadoParejaIzq(id: number): string {
    if (this.emparejadas().includes(id)) return 'emparejada';
    if (this.error()?.izq === id) return 'incorrecta';
    return this.selIzq() === id ? 'seleccionada' : '';
  }

  estadoParejaDer(id: number): string {
    if (this.emparejadas().includes(id)) return 'emparejada';
    if (this.error()?.der === id) return 'incorrecta';
    return this.selDer() === id ? 'seleccionada' : '';
  }

  // ════════ ORDENAR PASOS ════════

  private empezarRonda(i: number): void {
    this.ronda.set(i);
    const pasos = this.rondas()[i].pasos;
    this.banco.set(mezclar(pasos.map((_, j) => j)));
    this.elegidos.set([]);
    this.comprobado.set(false);
  }

  tomarPaso(paso: number): void {
    if (this.comprobado()) return;
    this.banco.update((b) => b.filter((p) => p !== paso));
    this.elegidos.update((e) => [...e, paso]);
  }

  devolverPaso(paso: number): void {
    if (this.comprobado()) return;
    this.elegidos.update((e) => e.filter((p) => p !== paso));
    this.banco.update((b) => [...b, paso]);
  }

  comprobarOrden(): void {
    const elegidos = this.elegidos();
    const bien = elegidos.filter((paso, posicion) => paso === posicion).length;
    this.aciertos.update((a) => a + bien);
    this.total.update((t) => t + elegidos.length);
    this.comprobado.set(true);
  }

  siguienteRonda(): void {
    const siguiente = this.ronda() + 1;
    if (siguiente >= this.rondas().length) this.finalizar();
    else this.empezarRonda(siguiente);
  }

  aciertosRonda(): number {
    return this.elegidos().filter((paso, posicion) => paso === posicion).length;
  }

  // ════════ FINAL ════════

  private finalizar(): void {
    this.limpiarTimers();
    this.terminado.set(true);

    if (!this.aprobado()) return;
    if (this.reto().completado) {
      this.estadoXp.set('practica');
      return;
    }

    this.estadoXp.set('guardando');
    this.retosService.completarReto(this.reto().id, this.aciertos(), this.total()).subscribe({
      next: (res) => {
        this.xpGanado.set(res.xpGanado);
        this.estadoXp.set('ganado');
        this.huboCambio = true;
      },
      error: (err) => {
        this.mensajeError.set(err.error?.error ?? 'No se pudo guardar el XP. Revisa tu conexión.');
        this.estadoXp.set('error');
      },
    });
  }

  salir(): void {
    this.limpiarTimers();
    this.cerrar.emit(this.huboCambio);
  }

  private limpiarTimers(): void {
    if (this.temporizador) clearTimeout(this.temporizador);
    if (this.avance) clearTimeout(this.avance);
    this.temporizador = null;
    this.avance = null;
  }
}
