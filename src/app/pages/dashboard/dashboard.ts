import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.authService.currentUser());

  get fotoUrl(): string | null {
    const foto = this.user()?.foto;
    return foto ? `http://localhost:3000${foto}` : null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
