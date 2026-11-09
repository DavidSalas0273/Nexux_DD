import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Reto {
  id: number;
  titulo: string;
  descripcion: string;
  xp: number;
  icono: string;
  completado: boolean;
  tipo: 'diario' | 'semanal';
}

@Component({
  selector: 'app-retos',
  imports: [CommonModule],
  templateUrl: './retos.html',
  styleUrl: './retos.css',
})
export class Retos {
  retosHoy: Reto[] = [
    { id: 1, titulo: 'Completa 3 lecciones', descripcion: 'Termina 3 lecciones hoy', xp: 50, icono: '📚', completado: true, tipo: 'diario' },
    { id: 2, titulo: 'Racha perfecta', descripcion: 'No pierdas ningún corazón', xp: 30, icono: '❤️', completado: false, tipo: 'diario' },
    { id: 3, titulo: 'Velocista', descripcion: 'Responde en menos de 5 seg', xp: 20, icono: '⚡', completado: false, tipo: 'diario' },
  ];

  retosSemana: Reto[] = [
    { id: 4, titulo: 'Maestro de salsas', descripcion: 'Completa la unidad de salsas madre', xp: 150, icono: '🍲', completado: false, tipo: 'semanal' },
    { id: 5, titulo: 'Sin errores', descripcion: 'Completa 5 lecciones sin fallos', xp: 100, icono: '🎯', completado: false, tipo: 'semanal' },
  ];
}
