import { Component, signal, computed, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Icono } from './icono';
import { ProgresoService } from '../../services/progreso.service';

export interface Pregunta {
  id: number;
  texto: string;
  opciones: string[];
  correcta: number; // índice 0-3
}

export interface Nivel {
  id: number;
  titulo: string;
  icono: string;
  preguntas: Pregunta[];
}

export interface Unidad {
  id: number;
  titulo: string;
  autor: string;
  /** Clase de color de la unidad en el CSS: 'verde' | 'morado' */
  tema: string;
  video: { tipo: 'archivo' | 'youtube'; src: string };
  niveles: Nivel[];
}

@Component({
  selector: 'app-aprender',
  imports: [CommonModule, Icono],
  templateUrl: './aprender.html',
  styleUrl: './aprender.css',
})
export class Aprender {
  private router = Router;
  private progresoService = inject(ProgresoService);

  constructor() {
    // Trae el avance guardado en el backend y lo une con la copia local,
    // por si algún nivel se completó sin conexión.
    this.progresoService.cargar().subscribe({
      next: (delServidor) => {
        const locales = this.nivelesCompletados();
        const soloLocales = locales.filter((id) => !delServidor.includes(id));
        const unidos = this.soloNivelesValidos([...delServidor, ...soloLocales]);
        this.nivelesCompletados.set(unidos);
        this.progresoService.guardarLocal(unidos);
        for (const id of soloLocales) {
          const total = this.niveles[id - 1]?.preguntas.length ?? 0;
          this.progresoService.guardar(id, 0, total).subscribe({ error: () => {} });
        }
      },
      error: () => {
        // Sin backend se sigue con la copia local
      },
    });
  }

  private soloNivelesValidos(ids: number[]): number[] {
    return [...new Set(ids)]
      .filter((id) => id >= 1 && id <= this.niveles.length)
      .sort((a, b) => a - b);
  }

  // Estado del video: la unidad cuyo video está abierto
  videoAbierto = signal<Unidad | null>(null);
  private sanitizer = inject(DomSanitizer);

  /** URL del video de YouTube marcada como segura para el iframe. */
  urlYoutube = computed<SafeResourceUrl | null>(() => {
    const unidad = this.videoAbierto();
    if (!unidad || unidad.video.tipo !== 'youtube') return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(unidad.video.src);
  });

  // Unidad 1: Giacomo Bocchio, técnicas culinarias
  private nivelesUnidad1: Nivel[] = [
    {
      id: 1,
      titulo: 'Mise en Place',
      icono: 'cuchillo',
      preguntas: [
        {
          id: 1,
          texto: '¿Qué usa Giacomo para que la tabla de picar no se mueva sobre la mesa?',
          opciones: [
            'Dos tiras de papel tela humedecido debajo de la tabla',
            'Un poco de aceite debajo de la tabla',
            'Cinta adhesiva en las esquinas',
            'Una tabla de plástico encima de otra de madera',
          ],
          correcta: 0,
        },
        {
          id: 2,
          texto: '¿Por qué hay que exprimir bien el trapo antes de ponerlo bajo la tabla?',
          opciones: [
            'Para que no manche la mesa',
            'Porque si está muy mojado, también patina',
            'Para que seque más rápido',
            'Para que no se rompa',
          ],
          correcta: 1,
        },
        {
          id: 3,
          texto: 'Si eres diestro, ¿dónde recomienda poner los cuchillos y herramientas?',
          opciones: [
            'Frente a la tabla, con el filo hacia afuera',
            'A la izquierda, dentro de un cajón',
            'A la derecha, sobre un paño y con el filo hacia adentro',
            'Encima de la tabla, junto al producto',
          ],
          correcta: 2,
        },
        {
          id: 4,
          texto: '¿Por qué el secador o trapo de cocina debe estar seco?',
          opciones: [
            'Porque mojado huele mal',
            'Porque el agua conduce el calor y te puedes quemar',
            'Porque mojado pesa más',
            'Porque mojado mancha la ropa',
          ],
          correcta: 1,
        },
        {
          id: 5,
          texto: '¿Cómo prefiere doblar Giacomo su secador?',
          opciones: [
            'En cuatro, del tamaño de su mano',
            'Enrollado como un tubo',
            'Por la mitad, una sola vez',
            'No lo dobla, lo deja extendido',
          ],
          correcta: 0,
        },
      ],
    },
    {
      id: 2,
      titulo: 'Cuchillos y Afilado',
      icono: 'chaira',
      preguntas: [
        {
          id: 6,
          texto: '¿Qué hace realmente la chaira (o asentador)?',
          opciones: [
            'Afila el cuchillo igual que una piedra',
            'Asienta el filo que ya tiene el cuchillo para que dure más',
            'Limpia el óxido de la hoja',
            'Le quita el filo para que sea más seguro',
          ],
          correcta: 1,
        },
        {
          id: 7,
          texto: '¿En qué ángulo aproximado se pasa el cuchillo por la chaira?',
          opciones: [
            '90 grados',
            '45 grados',
            'Entre 18 y 20 grados',
            '5 grados',
          ],
          correcta: 2,
        },
        {
          id: 8,
          texto: '¿En qué dirección se debe pasar el cuchillo por la chaira?',
          opciones: [
            'De punta a talón',
            'De talón a punta',
            'Solo por el centro de la hoja',
            'En círculos',
          ],
          correcta: 1,
        },
        {
          id: 9,
          texto: '¿Cuál es la principal razón por la que lloramos al picar cebolla?',
          opciones: [
            'Porque la cebolla está fría',
            'Porque el cuchillo no tiene filo y revienta las células',
            'Porque cortamos muy despacio',
            'Porque no la lavamos antes',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 3,
      titulo: 'Organización del Puesto',
      icono: 'puesto',
      preguntas: [
        {
          id: 10,
          texto: 'En el puesto detallado de verduras, ¿para qué sirve el contenedor del medio?',
          opciones: [
            'Para el producto terminado',
            'Para la merma (peladuras y lo que no se usa)',
            'Para el producto en bruto',
            'Para los cuchillos',
          ],
          correcta: 1,
        },
        {
          id: 11,
          texto: '¿Para qué puede servir la «merma útil», como los recortes de zanahoria?',
          opciones: [
            'Para tirarla directamente a la basura',
            'Para un fondo, una salsa o la comida del personal',
            'Solo para decorar el plato',
            'Para abonar plantas únicamente',
          ],
          correcta: 1,
        },
        {
          id: 12,
          texto: 'Al trabajar con papas, ¿qué cambio se hace en el puesto de trabajo?',
          opciones: [
            'Se usa un cuchillo más grande',
            'El contenedor final lleva agua para evitar que se oxiden',
            'Se trabaja sin tabla',
            'Se agrega sal al contenedor de merma',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 4,
      titulo: 'Cortes de Cocina',
      icono: 'zanahoria',
      preguntas: [
        {
          id: 13,
          texto: '¿Qué medida tiene el corte brunoise según el video?',
          opciones: [
            '1 a 2 milímetros',
            '1 centímetro',
            '5 milímetros',
            'Tiras largas de 5 cm',
          ],
          correcta: 0,
        },
        {
          id: 14,
          texto: 'Al hacer la brunoise, ¿por qué se mantiene la raíz de la cebolla?',
          opciones: [
            'Porque tiene más sabor',
            'Porque mantiene unidas las capas mientras cortas',
            'Para que no te haga llorar',
            'Porque se oxida si la cortas',
          ],
          correcta: 1,
        },
        {
          id: 15,
          texto: 'Para cortar la cebolla en pluma, ¿qué se le quita primero?',
          opciones: [
            'Las capas externas',
            'El corazón',
            'Nada, se corta entera',
            'Solo la punta superior',
          ],
          correcta: 1,
        },
        {
          id: 16,
          texto: '¿Para qué se pone la pluma de cebolla en agua con hielo?',
          opciones: [
            'Para que se ponga más crocante y se lave de sulfuros',
            'Para que se cocine',
            'Para cambiarle el color',
            'Para que se ablande',
          ],
          correcta: 0,
        },
      ],
    },
  ];

  // Unidad 2: Chef Machaen, fondos, caldos y consomés
  // Los ids siguen la numeración global para que el nivel 5 se desbloquee al terminar el 4.
  private nivelesUnidad2: Nivel[] = [
    {
      id: 5,
      titulo: 'Fondos y Caldos',
      icono: 'olla',
      preguntas: [
        {
          id: 17,
          texto: '¿Qué es un fondo en cocina?',
          opciones: [
            'Una sopa lista para servir con fideos',
            'Un líquido aromático de huesos, verduras y hierbas que sirve de base para otras preparaciones',
            'Una salsa espesa de harina y mantequilla',
            'El jugo que suelta la carne al asarse',
          ],
          correcta: 1,
        },
        {
          id: 18,
          texto: '¿Cuál es la diferencia principal entre un fondo y un caldo?',
          opciones: [
            'El caldo se sazona y se puede tomar solo; el fondo es una base sin sazonar',
            'El fondo lleva más agua que el caldo',
            'El caldo solo se hace con verduras',
            'No hay ninguna diferencia',
          ],
          correcta: 0,
        },
        {
          id: 19,
          texto: '¿Por qué un fondo se cocina a fuego bajo, sin hervir fuerte?',
          opciones: [
            'Para que se cocine más rápido',
            'Para que no se pegue la olla',
            'Para que quede limpio y no se enturbie',
            'Para que pierda el sabor de los huesos',
          ],
          correcta: 2,
        },
        {
          id: 20,
          texto: '¿Qué se hace con la espuma y las impurezas que suben durante la cocción?',
          opciones: [
            'Se mezclan con el líquido para dar sabor',
            'Se retiran con un cucharón',
            'Se dejan hasta el final y se cuelan',
            'Se les agrega sal para disolverlas',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 6,
      titulo: 'Fondo Oscuro',
      icono: 'hueso',
      preguntas: [
        {
          id: 21,
          texto: '¿Qué huesos lleva la receta de fondo oscuro del video?',
          opciones: [
            'Huesos de pollo',
            'Espinazos de pescado',
            'Huesos de res',
            'No lleva huesos',
          ],
          correcta: 2,
        },
        {
          id: 22,
          texto: '¿Qué se hace con los huesos para que el fondo quede oscuro?',
          opciones: [
            'Se tuestan hasta dorarlos antes de cocerlos en agua',
            'Se hierven primero y se tira esa agua',
            'Se les agrega salsa de soya',
            'Se cocinan congelados',
          ],
          correcta: 0,
        },
        {
          id: 23,
          texto: '¿Cuánto tiempo total toma preparar el fondo oscuro?',
          opciones: [
            '50 minutos',
            '2 horas',
            '7 horas',
            '24 horas',
          ],
          correcta: 2,
        },
        {
          id: 24,
          texto: '¿Para qué se usa el hilo de atar en esta receta?',
          opciones: [
            'Para atar los huesos y que no se deshagan',
            'Para amarrar las hierbas aromáticas y sacarlas fácil al final',
            'Para colgar la olla',
            'Para medir el nivel del agua',
          ],
          correcta: 1,
        },
      ],
    },
    {
      id: 7,
      titulo: 'Fondo Claro',
      icono: 'muslo',
      preguntas: [
        {
          id: 25,
          texto: '¿Con qué huesos se prepara el fondo claro del video?',
          opciones: [
            'Huesos de pollo',
            'Huesos de res tostados',
            'Huesos de cerdo',
            'Solo con verduras',
          ],
          correcta: 0,
        },
        {
          id: 26,
          texto: '¿Por qué se le llama fondo «claro»?',
          opciones: [
            'Porque lleva leche',
            'Porque se cuela con un paño blanco',
            'Porque los huesos no se tuestan antes de cocinarse',
            'Porque se prepara de día',
          ],
          correcta: 2,
        },
        {
          id: 27,
          texto: '¿Qué verduras forman la base aromática del fondo claro?',
          opciones: [
            'Papa, tomate y ajo',
            'Cebolla, zanahoria y apio',
            'Pimiento, calabaza y elote',
            'Solo cebolla',
          ],
          correcta: 1,
        },
        {
          id: 28,
          texto: '¿Cuántos litros rinde la receta de fondo claro?',
          opciones: [
            '1 litro',
            '2 litros',
            '4 litros',
            '10 litros',
          ],
          correcta: 2,
        },
      ],
    },
    {
      id: 8,
      titulo: 'Consomé',
      icono: 'tazon',
      preguntas: [
        {
          id: 29,
          texto: '¿De qué se parte para preparar el consomé de pollo?',
          opciones: [
            'De agua con cubos de caldo',
            'Del fondo de pollo preparado antes en el video',
            'Del fondo oscuro de res',
            'De leche y crema',
          ],
          correcta: 1,
        },
        {
          id: 30,
          texto: '¿Qué ingredientes se usan para clarificar el consomé?',
          opciones: [
            'Harina y mantequilla',
            'Yemas de huevo y crema',
            'Claras de huevo y carne molida de res',
            'Gelatina y azúcar',
          ],
          correcta: 2,
        },
        {
          id: 31,
          texto: 'Si empiezas con 2 litros de fondo, ¿cuánto consomé obtienes?',
          opciones: [
            '1 litro',
            '2 litros',
            '3 litros',
            '500 mililitros',
          ],
          correcta: 0,
        },
        {
          id: 32,
          texto: '¿Qué distingue a un consomé de un caldo común?',
          opciones: [
            'Que se sirve frío',
            'Que es espeso como una crema',
            'Que lleva fideos',
            'Que está clarificado: es transparente y de sabor concentrado',
          ],
          correcta: 3,
        },
      ],
    },
  ];

  unidades: Unidad[] = [
    {
      id: 1,
      titulo: 'Técnicas culinarias esenciales',
      autor: 'Giacomo Bocchio',
      tema: 'verde',
      video: {
        tipo: 'archivo',
        src: '/TE VOY A ENSEÑAR 7 TÉCNICAS CULINARIAS QUE TODO COCINERO DEBE SABER _ GIACOMO BOCCHIO.mp4',
      },
      niveles: this.nivelesUnidad1,
    },
    {
      id: 2,
      titulo: 'Fondos, caldos y consomés',
      autor: 'Chef Machaen',
      tema: 'morado',
      video: { tipo: 'youtube', src: 'https://www.youtube-nocookie.com/embed/zLw5w2OJvlo' },
      niveles: this.nivelesUnidad2,
    },
  ];

  /** Todos los niveles en orden; el id de cada nivel coincide con su posición + 1. */
  niveles: Nivel[] = this.unidades.flatMap(u => u.niveles);

  /** Una unidad está bloqueada hasta completar el último nivel de la anterior. */
  unidadBloqueada(unidad: Unidad): boolean {
    const primero = unidad.niveles[0].id;
    return primero > 1 && !this.estaCompletado(primero - 1);
  }

  // Estado del quiz
  nivelActivo = signal<number | null>(null);
  preguntaIndex = signal(0);
  respuestaSeleccionada = signal<number | null>(null);
  mostrarResultado = signal(false);
  nivelCompletado = signal(false);
  nivelesCompletados = signal<number[]>(this.progresoService.leerLocal());
  puntaje = signal(0);

  preguntaActual = computed(() => {
    const nivel = this.nivelActivo();
    if (nivel === null) return null;
    return this.niveles[nivel - 1].preguntas[this.preguntaIndex()];
  });

  totalPreguntas = computed(() => {
    const nivel = this.nivelActivo();
    if (nivel === null) return 0;
    return this.niveles[nivel - 1].preguntas.length;
  });

  progreso = computed(() => {
    const total = this.totalPreguntas();
    if (!total) return 0;
    return Math.round((this.preguntaIndex() / total) * 100);
  });

  esCorrecto = computed(() => {
    const sel = this.respuestaSeleccionada();
    const pregunta = this.preguntaActual();
    if (sel === null || !pregunta) return null;
    return sel === pregunta.correcta;
  });

  /** Primer nivel desbloqueado que aún no se ha completado (el que muestra "Empezar"). */
  nivelActualId = computed(() => {
    const hechos = this.nivelesCompletados();
    const siguiente = this.niveles.find(n => !hechos.includes(n.id));
    return siguiente ? siguiente.id : null;
  });

  precision = computed(() => {
    const total = this.totalPreguntas();
    if (!total) return 0;
    return Math.round((this.puntaje() / total) * 100);
  });

  /** Desplazamiento horizontal de cada paso del camino, en zigzag suave. */
  private readonly zigzag = [0, 44, 70, 44, 0, -44, -70, -44];
  desplazamiento(posicion: number): number {
    return this.zigzag[posicion % this.zigzag.length];
  }

  iniciarNivel(nivelId: number) {
    this.nivelActivo.set(nivelId);
    this.preguntaIndex.set(0);
    this.respuestaSeleccionada.set(null);
    this.mostrarResultado.set(false);
    this.nivelCompletado.set(false);
    this.puntaje.set(0);
  }

  seleccionarRespuesta(index: number) {
    if (this.respuestaSeleccionada() !== null) return; // ya respondió
    this.respuestaSeleccionada.set(index);
    this.mostrarResultado.set(true);
    if (index === this.preguntaActual()?.correcta) {
      this.puntaje.update(p => p + 1);
    }
  }

  siguientePregunta() {
    const idx = this.preguntaIndex() + 1;
    if (idx >= this.totalPreguntas()) {
      this.nivelCompletado.set(true);
      const nivelId = this.nivelActivo()!;
      if (!this.nivelesCompletados().includes(nivelId)) {
        this.nivelesCompletados.update(n => [...n, nivelId]);
      }
      // Guarda el avance del usuario (también actualiza su mejor puntaje)
      this.progresoService.guardarLocal(this.nivelesCompletados());
      this.progresoService.guardar(nivelId, this.puntaje(), this.totalPreguntas()).subscribe({ error: () => {} });
    } else {
      this.preguntaIndex.set(idx);
      this.respuestaSeleccionada.set(null);
      this.mostrarResultado.set(false);
    }
  }

  salirNivel() {
    this.nivelActivo.set(null);
    this.nivelCompletado.set(false);
  }

  estaCompletado(nivelId: number): boolean {
    return this.nivelesCompletados().includes(nivelId);
  }

  claseOpcion(index: number): string {
    const sel = this.respuestaSeleccionada();
    const pregunta = this.preguntaActual();
    if (!pregunta || sel === null) return '';
    if (index === pregunta.correcta) return 'correcta';
    if (index === sel && sel !== pregunta.correcta) return 'incorrecta';
    return 'opacada';
  }

  letrasOpciones = ['A', 'B', 'C', 'D'];
}
