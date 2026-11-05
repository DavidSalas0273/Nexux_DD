import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api';
  private readonly TOKEN_KEY = 'nexus_dd_token';
  private readonly USER_KEY = 'nexus_dd_user';

  // Signal con el usuario actual
  currentUser = signal<User | null>(this.loadUserFromStorage());

  /**
   * Inicia sesión con correo y contraseña.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(tap((res) => this.setSession(res)));
  }

  /**
   * Registra un nuevo usuario. Usa FormData para soportar la subida de foto.
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('correo', data.correo);
    formData.append('password', data.password);
    if (data.foto) {
      formData.append('foto', data.foto);
    }

    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/register`, formData)
      .pipe(tap((res) => this.setSession(res)));
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  /**
   * Verifica si hay un usuario autenticado.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el token JWT almacenado.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Guarda el token y el usuario en localStorage.
   */
  private setSession(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  /**
   * Carga el usuario desde localStorage al iniciar la app.
   */
  private loadUserFromStorage(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
