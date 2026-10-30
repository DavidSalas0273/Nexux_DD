import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LearningService } from '../../../core/services/learning.service';
import {
  CookingLevel,
  COOKING_LEVELS,
} from '../../../core/models/cooking-level.model';
import {
  LearningUnit,
  getRutaByLevel,
} from '../../../core/models/learning-path.model';

@Component({
  selector: 'app-course-preview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-preview.html',
  styleUrl: './course-preview.css',
})
export class CoursePreviewComponent implements OnInit {
  private auth     = inject(AuthService);
  private learning = inject(LearningService);
  private router   = inject(Router);

  readonly user = this.auth.currentUser;

  // Todas las rutas disponibles para comparar
  allCourses: { level: CookingLevel; label: string; icon: string; description: string; units: LearningUnit[] }[] = [];

  ngOnInit(): void {
    // Construir vista previa de cada curso
    this.allCourses = COOKING_LEVELS.map((l) => ({
      level:       l.value,
      label:       l.label,
      icon:        l.icon,
      description: l.learningPath,
      units:       getRutaByLevel(l.value),
    }));
  }

  get currentLevel(): CookingLevel {
    return (this.user()?.cookingLevel ?? 'principiante') as CookingLevel;
  }

  isCurrentLevel(level: CookingLevel): boolean {
    return this.currentLevel === level;
  }

  totalNodos(units: LearningUnit[]): number {
    return units.reduce((s, u) => s + u.nodos.length, 0);
  }

  totalXP(units: LearningUnit[]): number {
    return units.reduce(
      (s, u) => s + u.nodos.reduce((ns, n) => ns + n.xpRecompensa, 0),
      0
    );
  }

  irACurso(): void {
    this.router.navigate(['/aprender']);
  }

  cambiarNivel(): void {
    this.router.navigate(['/perfil/editar']);
  }
}
