import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

// Credenciales almacenadas en localStorage (simula un backend)
const STORAGE_KEY = 'nexus_users';
const SESSION_KEY = 'nexus_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Estado reactivo del usuario actual
  private _currentUser = signal<User | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  constructor(private router: Router) {
    this.restoreSession();
  }

  // ── Registro con correo y contraseña ────────────────────────────────────────
  register(email: string, password: string, displayName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const users = this.getStoredUsers();
      const exists = users.find((u) => u.email === email);

      if (exists) {
        return reject(new Error('Este correo ya está registrado.'));
      }

      // En producción la contraseña se hashea en el backend; aquí se guarda
      // junto al usuario solo para demostración local.
      const newUser: User & { password: string } = {
        uid: crypto.randomUUID(),
        email,
        displayName,
        photoURL: null,
        provider: 'email',
        createdAt: new Date(),
        password,
      };

      users.push(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

      const { password: _, ...safeUser } = newUser;
      this.openSession(safeUser);
      resolve();
    });
  }

  // ── Inicio de sesión con correo y contraseña ─────────────────────────────────
  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const users = this.getStoredUsers();
      const match = users.find(
        (u) => u.email === email && (u as any).password === password
      );

      if (!match) {
        return reject(new Error('Correo o contraseña incorrectos.'));
      }

      const { password: _, ...safeUser } = match as any;
      this.openSession(safeUser);
      resolve();
    });
  }

  // ── Inicio de sesión con Google (stub — integrar Firebase/OAuth en producción) ─
  loginWithGoogle(): Promise<void> {
    return new Promise((resolve) => {
      const mockGoogleUser: User = {
        uid: 'google-' + crypto.randomUUID(),
        email: 'usuario.google@gmail.com',
        displayName: 'Usuario Google',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user',
        provider: 'google',
        createdAt: new Date(),
      };
      this.openSession(mockGoogleUser);
      resolve();
    });
  }

  // ── Cerrar sesión ────────────────────────────────────────────────────────────
  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem(SESSION_KEY);
    this.router.navigate(['/auth/login']);
  }

  // ── Helpers privados ─────────────────────────────────────────────────────────
  private openSession(user: User): void {
    this._currentUser.set(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  private restoreSession(): void {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const user: User = JSON.parse(raw);
        this._currentUser.set(user);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }

  private getStoredUsers(): Array<User & { password: string }> {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
}
