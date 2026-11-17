import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/** Minijuego que abre cada reto. */
export type TipoJuego = 'relampago' | 'vf' | 'parejas' | 'ordenar' | 'maraton' | 'ordenar3';

export interface Reto {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string;
  xp: number;
  tipo: 'diario' | 'semanal';
  categoria: string;
  juego: TipoJuego | null;
  completado: boolean;
}

export interface RetosResponse {
  diarios: Reto[];
  semanales: Reto[];
  xpTotal: number;
}

export interface CompletarResponse {
  message: string;
  xpGanado: number;
  xpTotal: number;
}

export interface JugadorRanking {
  posicion: number;
  id: number;
  nombre: string;
  foto: string | null;
  /** XP ganado en el periodo (hoy o esta semana) */
  xp: number;
  /** XP acumulado desde siempre */
  xpTotal: number;
  esUsuario: boolean;
}

@Injectable({ providedIn: 'root' })
export class RetosService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/retos`;

  getRetos(): Observable<RetosResponse> {
    return this.http.get<RetosResponse>(this.API);
  }

  /** Envía el resultado del minijuego; el backend da el XP si hubo al menos 60% de aciertos. */
  completarReto(id: number, aciertos: number, total: number): Observable<CompletarResponse> {
    return this.http.post<CompletarResponse>(`${this.API}/${id}/completar`, { aciertos, total });
  }

  getRankingDiario(): Observable<JugadorRanking[]> {
    return this.http.get<JugadorRanking[]>(`${this.API}/ranking/diario`);
  }

  getRankingSemanal(): Observable<JugadorRanking[]> {
    return this.http.get<JugadorRanking[]>(`${this.API}/ranking/semanal`);
  }
}
