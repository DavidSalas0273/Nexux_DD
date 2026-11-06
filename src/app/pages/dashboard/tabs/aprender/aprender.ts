import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface Leccion {
  id: number;
  icono: string;
  estado: 'completada' | 'activa' | 'bloqueada';
  etiqueta?: string;
}

export interface Unidad {
  id: number;
  numero: number;
  titulo: string;
  subtitulo: string;
  color: string;
  lecciones: Leccion[];
}

@Component({
  selector: 'app-aprender',
  imports: [CommonModule],
  templateUrl: './aprender.html',
  styleUrl: './aprender.css',
})
export class Aprender {
  private router = inject(Router);

  unidades = signal<Unidad[]>([
    {
      id: 1,
      numero: 1,
      titulo: 'Fundamentos',
      subtitulo: 'Cortes, bases y técnicas esenciales',
      color: '#1565c0',
      lecciones: [
        { id: 1, icono: '🔪', estado: 'completada' },
        { id: 2, icono: '🥗', estado: 'completada' },
        { id: 3, icono: '🍳', estado: 'completada' },
        { id: 4, icono: '⭐', estado: 'completada' },
        { id: 5, icono: '🏆', estado: 'completada' },
      ],
    },
    {
      id: 2,
      numero: 2,
      titulo: 'Salsas madre',
      subtitulo: 'Bechamel, tomate y vinagreta',
      color: '#2e7d32',
      lecciones: [
        { id: 6, icono: '🌿', estado: 'completada' },
        { id: 7, icono: '🍲', estado: 'activa', etiqueta: 'EMPIEZA' },
        { id: 8, icono: '🔥', estado: 'bloqueada' },
        { id: 9, icono: '🔒', estado: 'bloqueada' },
        { id: 10, icono: '⭐', estado: 'bloqueada' },
      ],
    },
    {
      id: 3,
      numero: 3,
      titulo: 'Proteínas',
      subtitulo: 'Carnes, pescados y huevos',
      color: '#6a1b9a',
      lecciones: [
        { id: 11, icono: '🥩', estado: 'bloqueada' },
        { id: 12, icono: '🐟', estado: 'bloqueada' },
        { id: 13, icono: '🥚', estado: 'bloqueada' },
        { id: 14, icono: '🏅', estado: 'bloqueada' },
      ],
    },
  ]);

  iniciarLeccion(leccion: Leccion) {
    if (leccion.estado === 'bloqueada') return;
    this.router.navigate(['/dashboard/quiz', leccion.id]);
  }
}
