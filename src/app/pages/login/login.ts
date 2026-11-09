import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChild('platosList') platosListRef!: ElementRef<HTMLDivElement>;

  correo = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  /** Desplaza la barra de platos. dir: -1 izquierda, 1 derecha */
  scrollPlatos(dir: -1 | 1) {
    const el = this.platosListRef?.nativeElement;
    if (el) {
      el.scrollBy({ left: dir * 220, behavior: 'smooth' });
    }
  }

  onSubmit() {
    if (!this.correo() || !this.password()) {
      this.error.set('Por favor completa todos los campos');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login({ correo: this.correo(), password: this.password() }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al iniciar sesión');
        this.loading.set(false);
      },
    });
  }
}
