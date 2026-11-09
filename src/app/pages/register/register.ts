import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChild('platosList') platosListRef!: ElementRef<HTMLDivElement>;

  nombre = signal('');
  correo = signal('');
  password = signal('');
  foto = signal<File | null>(null);
  fotoPreview = signal<string | null>(null);
  error = signal('');
  loading = signal(false);

  scrollPlatos(dir: -1 | 1) {
    const el = this.platosListRef?.nativeElement;
    if (el) el.scrollBy({ left: dir * 220, behavior: 'smooth' });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.foto.set(file);
      const reader = new FileReader();
      reader.onload = () => this.fotoPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.nombre() || !this.correo() || !this.password()) {
      this.error.set('Por favor completa todos los campos');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService
      .register({
        nombre: this.nombre(),
        correo: this.correo(),
        password: this.password(),
        foto: this.foto() || undefined,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Error al registrar usuario');
          this.loading.set(false);
        },
      });
  }
}
