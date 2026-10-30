export type CookingLevel = 'principiante' | 'casera' | 'intermedio' | 'avanzado';

export interface CookingLevelOption {
  value: CookingLevel;
  label: string;
  description: string;
  icon: string;
  learningPath: string;
}

export const COOKING_LEVELS: CookingLevelOption[] = [
  {
    value: 'principiante',
    label: 'Principiante',
    description: 'Nunca has cocinado o apenas estás empezando. Aprenderás desde cero.',
    icon: '🌱',
    learningPath: 'Fundamentos de cocina, técnicas básicas y recetas simples.',
  },
  {
    value: 'casera',
    label: 'Cocina casera',
    description: 'Cocinas en casa con regularidad y dominas recetas cotidianas.',
    icon: '🏠',
    learningPath: 'Recetas familiares, organización de la cocina y variedad de platos.',
  },
  {
    value: 'intermedio',
    label: 'Intermedio',
    description: 'Tienes experiencia y quieres perfeccionar técnicas más complejas.',
    icon: '🍳',
    learningPath: 'Técnicas avanzadas, cocina internacional y emplatado profesional.',
  },
  {
    value: 'avanzado',
    label: 'Avanzado',
    description: 'Conoces bien la cocina y buscas llevarla al siguiente nivel.',
    icon: '👨‍🍳',
    learningPath: 'Alta cocina, fermentación, destilados y técnicas de chef.',
  },
];
