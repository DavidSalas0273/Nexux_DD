import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.authService.currentUser());

  readonly navItems = [
    { ruta: 'aprender', etiqueta: 'Aprender' },
    { ruta: 'retos', etiqueta: 'Retos' },
    { ruta: 'ranking', etiqueta: 'Ranking' },
    { ruta: 'perfil', etiqueta: 'Perfil' },
  ];

  fotoUrl = computed(() => {
    const foto = this.user()?.foto;
    return foto ? `http://localhost:3000${foto}` : null;
  });

  inicial = computed(() => (this.user()?.nombre?.trim()[0] ?? '?').toUpperCase());

  // Stats fijos por ahora (se conectarán al backend más adelante)
  readonly racha = 12;
  readonly gemas = 340;
  readonly vidas = 5;

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
