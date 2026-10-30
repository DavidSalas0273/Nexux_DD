import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';
import { LearningService } from '../../../core/services/learning.service';
import { DifficultyService } from '../../../core/services/difficulty.service';
import { getRutaByLevel, LearningNode } from '../../../core/models/learning-path.model';
import { CookingLevel } from '../../../core/models/cooking-level.model';

@Component({
  selector: 'app-lesson-player',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lesson-player.html',
  styleUrl: './lesson-player.css',
})
export class LessonPlayerComponent implements OnInit {
  private route      = inject(ActivatedRoute);
  private router     = inject(Router);
  private sanitizer  = inject(DomSanitizer);
  private auth       = inject(AuthService);
  private learning   = inject(LearningService);
  readonly difficulty = inject(DifficultyService);

  node        = signal<LearningNode | null>(null);
  safeUrl     = signal<SafeResourceUrl | null>(null);
  videoWatched = signal(false);   // se activa al hacer clic en "Ya vi el video"
  completed    = signal(false);
  xpEarned     = signal<number>(0);

  ngOnInit(): void {
    const nodeId = this.route.snapshot.paramMap.get('nodeId') ?? '';
    const level  = (this.auth.currentUser()?.cookingLevel ?? 'principiante') as CookingLevel;
    const uid    = this.auth.currentUser()?.uid;

    // Cargar progreso actualizado si aún no está cargado
    const base = getRutaByLevel(level);
    if (this.learning.units().length === 0 && uid) {
      this.learning.loadProgress(base);
    }

    // Buscar el nodo en las unidades
    const found = this.findNode(nodeId, base);
    if (!found) { this.router.navigate(['/aprender']); return; }

    this.node.set(found);

    // Sanitizar URL para el iframe
    if (found.videoUrl) {
      this.safeUrl.set(
        this.sanitizer.bypassSecurityTrustResourceUrl(found.videoUrl)
      );
    }
  }

  markVideoWatched(): void {
    this.videoWatched.set(true);
  }

  completarLeccion(): void {
    const n = this.node();
    if (!n || this.completed()) return;

    this.learning.completarNodo(n.id);
    const xp = this.learning.lastXP();
    this.xpEarned.set(xp);
    this.completed.set(true);

    // Volver a la ruta de aprendizaje tras 1.5s
    setTimeout(() => this.router.navigate(['/aprender']), 1500);
  }

  get duracionLabel(): string {
    const d = this.node()?.duracionMin;
    return d ? `${d} min` : '';
  }

  get xpLabel(): number {
    const base = this.node()?.xpRecompensa ?? 0;
    return this.difficulty.calculateXP(base);
  }

  private findNode(nodeId: string, units: ReturnType<typeof getRutaByLevel>): LearningNode | null {
    for (const unit of units) {
      const found = unit.nodos.find((n) => n.id === nodeId);
      if (found) return found;
    }
    return null;
  }
}
