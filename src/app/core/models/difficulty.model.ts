export type DifficultyMode = 'normal' | 'practica' | 'experto';

export interface DifficultyOption {
  value: DifficultyMode;
  label: string;
  icon: string;
  description: string;
  xpMultiplier: number;   // multiplicador de XP al completar nodos
  nodeLimit: number | null; // null = sin límite de intentos
}

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    value: 'practica',
    label: 'Práctica',
    icon: '🌱',
    description: 'Sin presión. Repite las lecciones todas las veces que necesites.',
    xpMultiplier: 0.75,
    nodeLimit: null,
  },
  {
    value: 'normal',
    label: 'Normal',
    icon: '🍳',
    description: 'El modo estándar. Progresa a tu ritmo y gana XP completo.',
    xpMultiplier: 1,
    nodeLimit: null,
  },
  {
    value: 'experto',
    label: 'Experto',
    icon: '🔥',
    description: 'Sin margen de error. Gana XP extra pero cada nodo cuenta.',
    xpMultiplier: 1.5,
    nodeLimit: 1,
  },
];

// Clave de localStorage para la dificultad del usuario
export const DIFFICULTY_KEY = 'nexus_difficulty';
