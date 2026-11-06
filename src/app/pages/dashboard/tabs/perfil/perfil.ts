import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

interface Insignia {
  icono: string;
  nombre: string;
  desbloqueada: boolean;
  color: string;
}

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.authService.currentUser());

  get inicial(): string {
    return (this.user()?.nombre?.charAt(0) ?? 'U').toUpperCase();
  }

  get fotoUrl(): string | null {
    const foto = this.user()?.foto;
    return foto ? `http://localhost:3000${foto}` : null;
  }

  get nombreUsuario(): string {
    const nombre = this.user()?.nombre ?? '';
    return '@' + nombre.toLowerCase().replace(/\s+/g, '.') + '.cocina';
  }

  estadisticas = [
    { icono: 'streak', valor: '12 días', etiqueta: 'Racha' },
    { icono: 'star', valor: '1.840', etiqueta: 'XP total' },
    { icono: 'trophy', valor: 'Plata', etiqueta: 'Liga' },
    { icono: 'recipe', valor: '23', etiqueta: 'Recetas' },
  ];

  insignias: Insignia[] = [
    { icono: 'streak', nombre: 'Racha de 7', desbloqueada: true, color: '#fff3e0' },
    { icono: 'leaf', nombre: 'Salsas madre', desbloqueada: true, color: '#e8f5e9' },
    { icono: 'recipe', nombre: 'Primer guiso', desbloqueada: true, color: '#fce4ec' },
    { icono: 'lock', nombre: 'Por ganar', desbloqueada: false, color: '#f5f5f5' },
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
