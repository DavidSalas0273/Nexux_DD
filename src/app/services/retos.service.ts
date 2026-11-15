import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reto {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string;
  xp: number;
  tipo: 'diario' | 'semanal';
  categoria: string;
  completado: boolean;
}

export interface RetosResponse {
  diarios: Reto[];
  semanales: Reto[];
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
  xp: number;
  diamantes: number;
  premioDiamantes: number;
  esUsuario: boolean;
}

@Injectable({ providedIn: 'root' })
export class RetosService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:3000/api/retos';

  getRetos(): Observable<RetosResponse> {
    return this.http.get<RetosResponse>(this.API);
  }

  completarReto(id: number): Observable<CompletarResponse> {
    return this.http.post<CompletarResponse>(`${this.API}/${id}/completar`, {});
  }

  getRankingDiario(): Observable<JugadorRanking[]> {
    return this.http.get<JugadorRanking[]>(`${this.API}/ranking/diario`);
  }

  getRankingSemanal(): Observable<JugadorRanking[]> {
    return this.http.get<JugadorRanking[]>(`${this.API}/ranking/semanal`);
  }

  getMisDiamantes(): Observable<{ diamantes: number }> {
    return this.http.get<{ diamantes: number }>(`${this.API}/mis-diamantes`);
  }
}
