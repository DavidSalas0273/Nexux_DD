import { CookingLevel } from './cooking-level.model';

export type NodeStatus = 'completada' | 'activa' | 'bloqueada';
export type NodeType   = 'leccion' | 'examen';

export interface LearningNode {
  id: string;
  titulo: string;
  tipo: NodeType;
  status: NodeStatus;
  xpRecompensa: number;
  descripcion: string;
  videoUrl?: string;       // URL del video pregrabado (YouTube embed o mp4)
  duracionMin?: number;    // duración estimada en minutos
}

export interface LearningUnit {
  id: string;
  titulo: string;
  descripcion: string;
  icon: string;
  nodos: LearningNode[];
}

// Genera la ruta de aprendizaje según el nivel del usuario
export function getRutaByLevel(level: CookingLevel): LearningUnit[] {
  const rutas: Record<CookingLevel, LearningUnit[]> = {

    principiante: [
      {
        id: 'u1',
        titulo: 'Unidad 1 — Fundamentos',
        descripcion: 'Conoce tu cocina y los utensilios básicos.',
        icon: '🍽️',
        nodos: [
          { id: 'n1', titulo: 'Utensilios básicos',       tipo: 'leccion', status: 'completada', xpRecompensa: 10, descripcion: 'Aprende para qué sirve cada utensilio.', videoUrl: 'https://www.youtube.com/embed/VVv26s5JMPI', duracionMin: 5 },
          { id: 'n2', titulo: 'Higiene en la cocina',     tipo: 'leccion', status: 'completada', xpRecompensa: 10, descripcion: 'Normas básicas de limpieza e higiene.', videoUrl: 'https://www.youtube.com/embed/aIq3Ax9Ucyg', duracionMin: 4 },
          { id: 'n3', titulo: 'Examen — Fundamentos',     tipo: 'examen',  status: 'activa',     xpRecompensa: 30, descripcion: 'Pon a prueba lo aprendido en la unidad.' },
        ],
      },
      {
        id: 'u2',
        titulo: 'Unidad 2 — Técnicas básicas',
        descripcion: 'Cortes, hervidos y salteados.',
        icon: '🔪',
        nodos: [
          { id: 'n4', titulo: 'Tipos de corte',           tipo: 'leccion', status: 'bloqueada', xpRecompensa: 15, descripcion: 'Juliana, brunoise, chiffonade y más.', videoUrl: 'https://www.youtube.com/embed/GRFSUGodF44', duracionMin: 7 },
          { id: 'n5', titulo: 'Hervir y cocer al vapor',  tipo: 'leccion', status: 'bloqueada', xpRecompensa: 15, descripcion: 'Temperaturas y tiempos de cocción.', videoUrl: 'https://www.youtube.com/embed/FP8TXgWrVWc', duracionMin: 6 },
          { id: 'n6', titulo: 'Saltear y sofreír',        tipo: 'leccion', status: 'bloqueada', xpRecompensa: 15, descripcion: 'Técnicas de cocción en sartén.', videoUrl: 'https://www.youtube.com/embed/rfSk5G7cMFA', duracionMin: 5 },
          { id: 'n7', titulo: 'Examen — Técnicas básicas',tipo: 'examen',  status: 'bloqueada', xpRecompensa: 40, descripcion: 'Demuestra tu dominio de las técnicas.' },
        ],
      },
      {
        id: 'u3',
        titulo: 'Unidad 3 — Primeras recetas',
        descripcion: 'Tus primeros platos completos.',
        icon: '🥗',
        nodos: [
          { id: 'n8',  titulo: 'Ensalada básica',          tipo: 'leccion', status: 'bloqueada', xpRecompensa: 20, descripcion: 'Combina ingredientes frescos.', videoUrl: 'https://www.youtube.com/embed/AZ7h-3RHSWA', duracionMin: 6 },
          { id: 'n9',  titulo: 'Sopa de verduras',         tipo: 'leccion', status: 'bloqueada', xpRecompensa: 20, descripcion: 'Caldo casero paso a paso.', videoUrl: 'https://www.youtube.com/embed/k4HdPCX9WvA', duracionMin: 8 },
          { id: 'n10', titulo: 'Examen — Primeras recetas',tipo: 'examen',  status: 'bloqueada', xpRecompensa: 50, descripcion: 'Evalúa tus primeras preparaciones.' },
        ],
      },
    ],

    casera: [
      {
        id: 'u1',
        titulo: 'Unidad 1 — Organización del hogar',
        descripcion: 'Planifica tu cocina semanal.',
        icon: '🏠',
        nodos: [
          { id: 'n1', titulo: 'Despensa inteligente',   tipo: 'leccion', status: 'completada', xpRecompensa: 10, descripcion: 'Qué tener siempre en la despensa.', videoUrl: 'https://www.youtube.com/embed/nQ6TfzaG1dg', duracionMin: 5 },
          { id: 'n2', titulo: 'Meal prep básico',       tipo: 'leccion', status: 'activa',     xpRecompensa: 15, descripcion: 'Prepara comida para varios días.', videoUrl: 'https://www.youtube.com/embed/6P1UdWDzDn4', duracionMin: 8 },
          { id: 'n3', titulo: 'Examen — Organización',  tipo: 'examen',  status: 'bloqueada',  xpRecompensa: 30, descripcion: 'Pon a prueba tu planificación.' },
        ],
      },
      {
        id: 'u2',
        titulo: 'Unidad 2 — Recetas familiares',
        descripcion: 'Platos que toda la familia disfruta.',
        icon: '🍲',
        nodos: [
          { id: 'n4', titulo: 'Arroz perfecto',              tipo: 'leccion', status: 'bloqueada', xpRecompensa: 15, descripcion: 'La técnica infalible para el arroz.', videoUrl: 'https://www.youtube.com/embed/HSDmJUMHkUE', duracionMin: 6 },
          { id: 'n5', titulo: 'Guisos y estofados',          tipo: 'leccion', status: 'bloqueada', xpRecompensa: 20, descripcion: 'Cocción lenta para sabores profundos.', videoUrl: 'https://www.youtube.com/embed/4q5CiCTWojc', duracionMin: 9 },
          { id: 'n6', titulo: 'Examen — Recetas familiares', tipo: 'examen',  status: 'bloqueada', xpRecompensa: 40, descripcion: 'Demuestra tus recetas del hogar.' },
        ],
      },
    ],

    intermedio: [
      {
        id: 'u1',
        titulo: 'Unidad 1 — Salsas madre',
        descripcion: 'Las 5 salsas base de la cocina clásica.',
        icon: '🫕',
        nodos: [
          { id: 'n1', titulo: 'Bechamel',              tipo: 'leccion', status: 'completada', xpRecompensa: 20, descripcion: 'La salsa blanca clásica francesa.', videoUrl: 'https://www.youtube.com/embed/CgBnOHVMTsE', duracionMin: 7 },
          { id: 'n2', titulo: 'Velouté',               tipo: 'leccion', status: 'completada', xpRecompensa: 20, descripcion: 'Fondo claro con roux.', videoUrl: 'https://www.youtube.com/embed/nrm4GBqTDqQ', duracionMin: 6 },
          { id: 'n3', titulo: 'Española',              tipo: 'leccion', status: 'activa',     xpRecompensa: 20, descripcion: 'Salsa oscura con fondo de res.', videoUrl: 'https://www.youtube.com/embed/0w48Q0PGduA', duracionMin: 8 },
          { id: 'n4', titulo: 'Tomate y Holandesa',    tipo: 'leccion', status: 'bloqueada',  xpRecompensa: 20, descripcion: 'Las últimas dos salsas madre.', videoUrl: 'https://www.youtube.com/embed/pYIV5mfhvXQ', duracionMin: 9 },
          { id: 'n5', titulo: 'Examen — Salsas madre', tipo: 'examen',  status: 'bloqueada',  xpRecompensa: 60, descripcion: 'Demuestra tu dominio de las salsas.' },
        ],
      },
      {
        id: 'u2',
        titulo: 'Unidad 2 — Cocina internacional',
        descripcion: 'Sabores del mundo en tu cocina.',
        icon: '🌍',
        nodos: [
          { id: 'n6', titulo: 'Cocina italiana',         tipo: 'leccion', status: 'bloqueada', xpRecompensa: 25, descripcion: 'Pastas y risottos auténticos.', videoUrl: 'https://www.youtube.com/embed/bJUiWdM__Qw', duracionMin: 10 },
          { id: 'n7', titulo: 'Cocina asiática',         tipo: 'leccion', status: 'bloqueada', xpRecompensa: 25, descripcion: 'Wok, curry y técnicas orientales.', videoUrl: 'https://www.youtube.com/embed/fRFpNSS8ER4', duracionMin: 8 },
          { id: 'n8', titulo: 'Examen — Internacional',  tipo: 'examen',  status: 'bloqueada', xpRecompensa: 60, descripcion: 'Pon a prueba tus recetas del mundo.' },
        ],
      },
    ],

    avanzado: [
      {
        id: 'u1',
        titulo: 'Unidad 1 — Alta cocina',
        descripcion: 'Técnicas de cocina profesional.',
        icon: '👨‍🍳',
        nodos: [
          { id: 'n1', titulo: 'Sous vide',              tipo: 'leccion', status: 'completada', xpRecompensa: 30, descripcion: 'Cocción al vacío a baja temperatura.', videoUrl: 'https://www.youtube.com/embed/RKyH0xLSKSY', duracionMin: 10 },
          { id: 'n2', titulo: 'Emplatado profesional',  tipo: 'leccion', status: 'activa',     xpRecompensa: 30, descripcion: 'Presentación de platos de restaurante.', videoUrl: 'https://www.youtube.com/embed/g3K3vxv-5jU', duracionMin: 9 },
          { id: 'n3', titulo: 'Examen — Alta cocina',   tipo: 'examen',  status: 'bloqueada',  xpRecompensa: 80, descripcion: 'Demuestra tu nivel de chef.' },
        ],
      },
      {
        id: 'u2',
        titulo: 'Unidad 2 — Fermentación',
        descripcion: 'El arte de la fermentación y conservación.',
        icon: '🧪',
        nodos: [
          { id: 'n4', titulo: 'Fermentación básica',     tipo: 'leccion', status: 'bloqueada', xpRecompensa: 35, descripcion: 'Chucrut, kéfir y fermentados caseros.', videoUrl: 'https://www.youtube.com/embed/bKM47s7I2kY', duracionMin: 11 },
          { id: 'n5', titulo: 'Encurtidos artesanales',  tipo: 'leccion', status: 'bloqueada', xpRecompensa: 35, descripcion: 'Conservas y encurtidos profesionales.', videoUrl: 'https://www.youtube.com/embed/pPgv7KKhQ1o', duracionMin: 8 },
          { id: 'n6', titulo: 'Examen — Fermentación',   tipo: 'examen',  status: 'bloqueada', xpRecompensa: 80, descripcion: 'Demuestra tu dominio de la fermentación.' },
        ],
      },
    ],

  };

  return rutas[level] ?? rutas['principiante'];
}
