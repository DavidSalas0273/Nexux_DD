import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface ProgresoNivel {
  nivel_id: number;
  mejor_puntaje: number;
  total_preguntas: number;
  completado_at: string;
}

/**
 * Guarda y recupera los niveles completados de cada usuario en Aprender.
 * La fuente de verdad es el backend; localStorage es solo una copia por usuario
 * para pintar el camino al instante y no perder avances si el backend falla.
 */
@Injectable({ providedIn: 'root' })
export class ProgresoService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly API_URL = `${environment.apiUrl}/progress`;

  /** Niveles completados según la copia local del usuario actual. */
  leerLocal(): number[] {
    const clave = this.claveLocal();
    if (!clave) return [];
    try {
      const guardado = localStorage.getItem(clave);
      const datos = guardado ? JSON.parse(guardado) : [];
      return Array.isArray(datos) ? datos.filter((n) => Number.isInteger(n)) : [];
    } catch {
      return [];
    }
  }

  guardarLocal(niveles: number[]): void {
    const clave = this.claveLocal();
    if (!clave) return;
    try {
      localStorage.setItem(clave, JSON.stringify(niveles));
    } catch {
      // sin almacenamiento disponible: el backend sigue guardando
    }
  }

  /** Niveles completados según el backend. */
  cargar(): Observable<number[]> {
    return this.http
      .get<{ niveles: ProgresoNivel[] }>(this.API_URL)
      .pipe(map((res) => res.niveles.map((n) => n.nivel_id)));
  }

  /** Registra un nivel completado con su puntaje. */
  guardar(nivelId: number, puntaje: number, total: number): Observable<ProgresoNivel> {
    return this.http
      .post<{ nivel: ProgresoNivel }>(this.API_URL, { nivelId, puntaje, total })
      .pipe(map((res) => res.nivel));
  }

  private claveLocal(): string | null {
    const usuario = this.auth.currentUser();
    return usuario ? `nexus_dd_progreso_${usuario.id}` : null;
  }
}
