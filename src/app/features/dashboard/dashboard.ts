import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  private auth = inject(AuthService);
  readonly user = this.auth.currentUser;

  logout(): void {
    this.auth.logout();
  }
}
