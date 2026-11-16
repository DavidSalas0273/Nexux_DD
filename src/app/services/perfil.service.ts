import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

export interface DiaActividad {
  /** YYYY-MM-DD */
  fecha: string;
  xp: number;
}

export interface ResumenPerfil {
  usuario: {
    id: number;
    nombre: string;
    correo: string;
    foto: string | null;
    bio: string | null;
    metaDiaria: number;
    creadoEn: string;
  };
  xpTotal: number;
  leccionesCompletadas: number;
  leccionesPerfectas: number;
  retosCompletados: number;
  diasActivos: number;
  posicionSemanal: number;
  /** últimos 7 días, de más antiguo a hoy */
  actividad: DiaActividad[];
}

export interface CambiosPerfil {
  nombre?: string;
  bio?: string;
  metaDiaria?: number;
  foto?: File;
}

export interface PerfilActualizado {
  user: User;
  bio: string | null;
  metaDiaria: number;
}

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private readonly API = 'http://localhost:3000/api/users/profile';

  /** Metas diarias que se pueden elegir (deben coincidir con el backend). */
  readonly metasDiarias = [10, 20, 30, 50];

  getResumen(): Observable<ResumenPerfil> {
    return this.http.get<ResumenPerfil>(`${this.API}/resumen`);
  }

  /** Envía solo los campos que cambian. También actualiza el usuario en sesión. */
  actualizar(cambios: CambiosPerfil): Observable<PerfilActualizado> {
    const form = new FormData();
    if (cambios.nombre !== undefined) form.append('nombre', cambios.nombre);
    if (cambios.bio !== undefined) form.append('bio', cambios.bio);
    if (cambios.metaDiaria !== undefined) form.append('metaDiaria', String(cambios.metaDiaria));
    if (cambios.foto) form.append('foto', cambios.foto);

    return this.http
      .put<PerfilActualizado>(this.API, form)
      .pipe(tap((res) => this.auth.actualizarUsuario(res.user)));
  }
}
