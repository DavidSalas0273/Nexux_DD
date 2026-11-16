/** Ligas según el XP total acumulado (se usan en Ranking y Perfil). */
export interface Liga {
  nombre: string;
  clase: string;
  desde: number;
}

export const LIGAS: Liga[] = [
  { nombre: 'Bronce', clase: 'bronce', desde: 0 },
  { nombre: 'Plata', clase: 'plata', desde: 150 },
  { nombre: 'Oro', clase: 'oro', desde: 400 },
  { nombre: 'Esmeralda', clase: 'esmeralda', desde: 900 },
];

export function ligaPara(xp: number): Liga {
  return [...LIGAS].reverse().find((l) => xp >= l.desde) ?? LIGAS[0];
}

export function siguienteLiga(xp: number): Liga | null {
  return LIGAS.find((l) => l.desde > xp) ?? null;
}
