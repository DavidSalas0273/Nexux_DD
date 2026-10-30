import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  CookingLevel,
  CookingLevelOption,
  COOKING_LEVELS,
} from '../../../core/models/cooking-level.model';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfileComponent implements OnInit {
  private auth   = inject(AuthService);
  private fb     = inject(FormBuilder);
  private router = inject(Router);

  readonly user   = this.auth.currentUser;
  readonly levels: CookingLevelOption[] = COOKING_LEVELS;

  form!: FormGroup;
  loading  = signal(false);
  success  = signal(false);
  error    = signal<string | null>(null);

  // nivel seleccionado en el selector visual
  selectedLevel = signal<CookingLevel | null>(null);

  ngOnInit(): void {
    const u = this.user();
    this.form = this.fb.group({
      displayName: [
        u?.displayName ?? '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(40)],
      ],
    });
    this.selectedLevel.set(u?.cookingLevel ?? null);
  }

  selectLevel(level: CookingLevel): void {
    this.selectedLevel.set(level);
  }

  isSelected(level: CookingLevel): boolean {
    return this.selectedLevel() === level;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    try {
      const { displayName } = this.form.value;
      const level = this.selectedLevel();

      // Actualizar nombre
      this.auth.updateProfile({ displayName });

      // Actualizar nivel si cambió
      if (level && level !== this.user()?.cookingLevel) {
        this.auth.saveCookingLevel(level);
      }

      this.success.set(true);

      // Redirige al perfil tras 1.2s para que el usuario vea la confirmación
      setTimeout(() => this.router.navigate(['/perfil']), 1200);
    } catch (err: any) {
      this.error.set(err.message ?? 'Ocurrió un error al guardar los cambios.');
    } finally {
      this.loading.set(false);
    }
  }

  get nameCtrl() { return this.form.get('displayName')!; }
}
