import { Pipe, PipeTransform } from '@angular/core';
import { CookingLevel, CookingLevelOption } from '../models/cooking-level.model';

@Pipe({ name: 'levelPath', standalone: true })
export class LevelPathPipe implements PipeTransform {
  transform(levels: CookingLevelOption[], selected: CookingLevel): string {
    return levels.find((l) => l.value === selected)?.learningPath ?? '';
  }
}
