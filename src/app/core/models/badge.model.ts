export type BadgeCategory = 'racha' | 'recetas' | 'tecnica' | 'especial';

export interface Badge {
  id: string;
  nombre: string;
  descripcion: string;       // cómo se obtiene
  icon: string;              // emoji
  categoria: BadgeCategory;
  condicion: (stats: BadgeConditionInput) => boolean;
}

// Datos que se evalúan para desbloquear una insignia
export interface BadgeConditionInput {
  racha: number;
  recetasCompletadas: number;
  xpTotal: number;
}

// Insignia con estado de si ya fue obtenida
export interface BadgeStatus extends Badge {
  obtenida: boolean;
}

// Catálogo completo de insignias
export const BADGES: Badge[] = [
  // ── Racha ────────────────────────────────────────────────────────────────
  {
    id: 'racha-3',
    nombre: 'Primer calor',
    descripcion: 'Mantén una racha de 3 días consecutivos.',
    icon: '🔥',
    categoria: 'racha',
    condicion: ({ racha }) => racha >= 3,
  },
  {
    id: 'racha-7',
    nombre: 'Racha de 7',
    descripcion: 'Mantén una racha de 7 días consecutivos.',
    icon: '🌶️',
    categoria: 'racha',
    condicion: ({ racha }) => racha >= 7,
  },
  {
    id: 'racha-30',
    nombre: 'Chef constante',
    descripcion: 'Mantén una racha de 30 días consecutivos.',
    icon: '🏅',
    categoria: 'racha',
    condicion: ({ racha }) => racha >= 30,
  },

  // ── Recetas ───────────────────────────────────────────────────────────────
  {
    id: 'primer-guiso',
    nombre: 'Primer guiso',
    descripcion: 'Completa tu primera receta.',
    icon: '🍲',
    categoria: 'recetas',
    condicion: ({ recetasCompletadas }) => recetasCompletadas >= 1,
  },
  {
    id: 'recetas-5',
    nombre: 'Manos en la masa',
    descripcion: 'Completa 5 recetas.',
    icon: '🤲',
    categoria: 'recetas',
    condicion: ({ recetasCompletadas }) => recetasCompletadas >= 5,
  },
  {
    id: 'recetas-20',
    nombre: 'Cocinero prolífico',
    descripcion: 'Completa 20 recetas.',
    icon: '📖',
    categoria: 'recetas',
    condicion: ({ recetasCompletadas }) => recetasCompletadas >= 20,
  },

  // ── Técnica ───────────────────────────────────────────────────────────────
  {
    id: 'salsas-madre',
    nombre: 'Salsas madre',
    descripcion: 'Completa las 5 recetas de salsas madre.',
    icon: '🫕',
    categoria: 'tecnica',
    condicion: ({ recetasCompletadas }) => recetasCompletadas >= 5,
  },
  {
    id: 'cuchillo-afilado',
    nombre: 'Cuchillo afilado',
    descripcion: 'Alcanza 500 XP.',
    icon: '🔪',
    categoria: 'tecnica',
    condicion: ({ xpTotal }) => xpTotal >= 500,
  },

  // ── Especial ──────────────────────────────────────────────────────────────
  {
    id: 'bienvenido',
    nombre: 'Bienvenido a Nexus',
    descripcion: 'Completa tu registro y elige tu nivel.',
    icon: '🎉',
    categoria: 'especial',
    condicion: () => true,   // siempre desbloqueada al tener cuenta
  },
  {
    id: 'maestro-xp',
    nombre: 'Maestro XP',
    descripcion: 'Acumula 3000 XP.',
    icon: '💎',
    categoria: 'especial',
    condicion: ({ xpTotal }) => xpTotal >= 3000,
  },
];
