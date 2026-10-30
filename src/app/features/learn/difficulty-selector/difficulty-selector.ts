import { Component, inject } from '@angular/core';
import { DifficultyService } from '../../../core/services/difficulty.service';
import { DifficultyMode } from '../../../core/models/difficulty.model';

@Component({
  selector: 'app-difficulty-selector',
  standalone: true,
  templateUrl: './difficulty-selector.html',
  styleUrl: './difficulty-selector.css',
})
export class DifficultySelectorComponent {
  readonly difficultyService = inject(DifficultyService);

  readonly options = this.difficultyService.options;
  readonly current = this.difficultyService.current;

  select(mode: DifficultyMode): void {
    this.difficultyService.setMode(mode);
  }

  isSelected(mode: DifficultyMode): boolean {
    return this.difficultyService.mode() === mode;
  }
}
