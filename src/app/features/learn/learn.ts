import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  LearningUnit,
  LearningNode,
  NodeStatus,
  getRutaByLevel,
} from '../../core/models/learning-path.model';
import { CookingLevel } from '../../core/models/cooking-level.model';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './learn.html',
  styleUrl: './learn.css',
})
export class LearnComponent implements OnInit {
  private auth = inject(AuthService);

  readonly user  = this.auth.currentUser;
  units = signal<LearningUnit[]>([]);

  // Unidad expandida actualmente
  expandedUnit = signal<string | null>(null);

  ngOnInit(): void {
    const level = (this.user()?.cookingLevel ?? 'principiante') as CookingLevel;
    this.units.set(getRutaByLevel(level));
    // Expande la primera unidad con nodos activos por defecto
    const first = this.units().find((u) =>
      u.nodos.some((n) => n.status === 'activa' || n.status === 'completada')
    );
    if (first) this.expandedUnit.set(first.id);
  }

  toggleUnit(uid: string): void {
    this.expandedUnit.set(this.expandedUnit() === uid ? null : uid);
  }

  isExpanded(uid: string): boolean {
    return this.expandedUnit() === uid;
  }

  // Cuántos nodos completados tiene una unidad
  completadas(unit: LearningUnit): number {
    return unit.nodos.filter((n) => n.status === 'completada').length;
  }

  // Progreso porcentual de la unidad
  progreso(unit: LearningUnit): number {
    return Math.round((this.completadas(unit) / unit.nodos.length) * 100);
  }

  // Icono según el estado del nodo
  nodeIcon(node: LearningNode): string {
    if (node.status === 'completada') return '✅';
    if (node.status === 'bloqueada')  return '🔒';
    return node.tipo === 'examen' ? '📝' : '📖';
  }

  // Etiqueta de tipo
  tipoLabel(node: LearningNode): string {
    return node.tipo === 'examen' ? 'Examen' : 'Lección';
  }

  // Clase CSS del nodo según su estado
  nodeClass(status: NodeStatus): string {
    return `node--${status}`;
  }

  // XP total disponible en una unidad
  xpUnidad(unit: LearningUnit): number {
    return unit.nodos.reduce((sum, n) => sum + n.xpRecompensa, 0);
  }

  // Nivel legible
  get nivelLabel(): string {
    return this.user()?.cookingLevel ?? 'principiante';
  }
}
