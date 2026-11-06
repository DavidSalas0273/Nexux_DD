import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface Pregunta {
  id: number;
  categoria: string;
  paso: number;
  totalPasos: number;
  texto: string;
  opciones: string[];
  correcta: number;
}

@Component({
  selector: 'app-quiz',
  imports: [CommonModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  vidas = signal(5);
  seleccionada = signal<number | null>(null);
  revisada = signal(false);
  correcta = signal(false);

  preguntas: Pregunta[] = [
    {
      id: 1,
      categoria: 'TÉCNICA',
      paso: 1,
      totalPasos: 10,
      texto: '¿Cuál es el primer paso para hacer una bechamel?',
      opciones: ['Añadir la leche directamente', 'Derretir la mantequilla', 'Añadir la harina al fuego', 'Batir los huevos'],
      correcta: 1,
    },
    {
      id: 2,
      categoria: 'TÉCNICA',
      paso: 2,
      totalPasos: 10,
      texto: '¿Qué es un roux?',
      opciones: ['Una mezcla de vino y caldo', 'Una mezcla de mantequilla y harina cocinadas', 'Un tipo de queso francés', 'Una técnica de corte'],
      correcta: 1,
    },
    {
      id: 3,
      categoria: 'TÉCNICA',
      paso: 3,
      totalPasos: 10,
      texto: '¿A qué temperatura se cocina el roux?',
      opciones: ['A fuego alto', 'A fuego muy bajo', 'A fuego medio-bajo', 'En el horno a 200°'],
      correcta: 2,
    },
    {
      id: 4,
      categoria: 'TÉCNICA',
      paso: 4,
      totalPasos: 10,
      texto: '¿Cómo evitas que la bechamel quede con grumos?',
      opciones: [
        'Añadir la leche fría de golpe',
        'Añadir la leche tibia poco a poco, batiendo',
        'Subir el fuego al máximo',
        'Colar la harina al final',
      ],
      correcta: 1,
    },
  ];

  preguntaIndex = signal(0);

  preguntaActual = computed(() => this.preguntas[this.preguntaIndex()]);
  progreso = computed(() => (this.preguntaActual().paso / this.preguntaActual().totalPasos) * 100);

  seleccionar(index: number) {
    if (this.revisada()) return;
    this.seleccionada.set(index);
  }

  comprobar() {
    if (this.seleccionada() === null || this.revisada()) return;
    const esCorrecta = this.seleccionada() === this.preguntaActual().correcta;
    this.revisada.set(true);
    this.correcta.set(esCorrecta);
    if (!esCorrecta) {
      this.vidas.update(v => Math.max(0, v - 1));
    }
  }

  siguiente() {
    if (this.preguntaIndex() < this.preguntas.length - 1) {
      this.preguntaIndex.update(i => i + 1);
      this.seleccionada.set(null);
      this.revisada.set(false);
      this.correcta.set(false);
    } else {
      this.router.navigate(['/dashboard/aprender']);
    }
  }

  cerrar() {
    this.router.navigate(['/dashboard/aprender']);
  }

  getClaseOpcion(index: number): string {
    if (!this.revisada()) {
      return this.seleccionada() === index ? 'seleccionada' : '';
    }
    if (index === this.preguntaActual().correcta) return 'correcta';
    if (index === this.seleccionada()) return 'incorrecta';
    return '';
  }
}
