import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  CookingLevel,
  CookingLevelOption,
  COOKING_LEVELS,
} from '../../../core/models/cooking-level.model';
import { LevelPathPipe } from '../../../core/pipes/level-path.pipe';

@Component({
  selector: 'app-cooking-level',
  standalone: true,
  imports: [LevelPathPipe],
  templateUrl: './cooking-level.html',
  styleUrl: './cooking-level.css',
})
export class CookingLevelComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly levels: CookingLevelOption[] = COOKING_LEVELS;
  readonly user = this.auth.currentUser;

  selected = signal<CookingLevel | null>(null);
  loading = signal(false);

  select(level: CookingLevel): void {
    this.selected.set(level);
  }

  confirm(): void {
    const level = this.selected();
    if (!level) return;

    this.loading.set(true);
    this.auth.saveCookingLevel(level);
    this.router.navigate(['/dashboard']);
  }

  isSelected(level: CookingLevel): boolean {
    return this.selected() === level;
  }
}
