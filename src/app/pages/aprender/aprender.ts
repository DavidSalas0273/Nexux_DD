import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Icono } from './icono';

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

@Component({
  selector: 'app-aprender',
  imports: [CommonModule, Icono],
  templateUrl: './aprender.html',
  styleUrl: './aprender.css',
})
export class Aprender {
  private router = Router;

  // Estado del video
  videoVisible = signal(false);

  // Niveles y preguntas
  niveles: Nivel[] = [
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

  // Estado del quiz
  nivelActivo = signal<number | null>(null);
  preguntaIndex = signal(0);
  respuestaSeleccionada = signal<number | null>(null);
  mostrarResultado = signal(false);
  nivelCompletado = signal(false);
  nivelesCompletados = signal<number[]>([]);
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
