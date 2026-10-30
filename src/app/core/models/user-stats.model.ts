export type Liga = 'Bronce' | 'Plata' | 'Oro' | 'Platino' | 'Diamante';

export interface UserStats {
  uid: string;
  xpTotal: number;
  racha: number;           // días consecutivos activo
  recetasCompletadas: number;
  liga: Liga;
}

// Calcula la liga según el XP acumulado
export function calcularLiga(xp: number): Liga {
  if (xp >= 5000) return 'Diamante';
  if (xp >= 3000) return 'Platino';
  if (xp >= 1500) return 'Oro';
  if (xp >= 500)  return 'Plata';
  return 'Bronce';
}

// Estadísticas por defecto para un usuario nuevo
export function defaultStats(uid: string): UserStats {
  return {
    uid,
    xpTotal: 0,
    racha: 0,
    recetasCompletadas: 0,
    liga: 'Bronce',
  };
}
