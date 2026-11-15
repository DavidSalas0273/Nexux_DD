/**
 * Contenido de los minijuegos de Retos.
 * Sale de las clases de la sección Aprender (Giacomo Bocchio y Chef Machaen).
 */

import { TipoJuego } from '../../../../services/retos.service';

export interface PreguntaRapida {
  texto: string;
  opciones: string[];
  /** índice de la opción correcta antes de mezclar */
  correcta: number;
}

export interface FraseVF {
  texto: string;
  verdadera: boolean;
}

export interface Pareja {
  termino: string;
  definicion: string;
}

export interface Procedimiento {
  titulo: string;
  pasos: string[];
}

export interface ConfigJuego {
  /** cantidad de preguntas, frases, parejas o recetas */
  cantidad: number;
  /** segundos por pregunta (0 = sin tiempo) */
  segundos: number;
  /** texto corto para la tarjeta del reto */
  resumen: string;
}

export const CONFIG_JUEGOS: Record<TipoJuego, ConfigJuego> = {
  relampago: { cantidad: 6, segundos: 10, resumen: '6 preguntas, 10 s cada una' },
  maraton: { cantidad: 12, segundos: 7, resumen: '12 preguntas, 7 s cada una' },
  vf: { cantidad: 8, segundos: 6, resumen: '8 frases, 6 s cada una' },
  parejas: { cantidad: 5, segundos: 0, resumen: '5 parejas' },
  ordenar: { cantidad: 1, segundos: 0, resumen: '1 receta' },
  ordenar3: { cantidad: 3, segundos: 0, resumen: '3 recetas' },
};

export const PREGUNTAS_RAPIDAS: PreguntaRapida[] = [
  { texto: '¿Cuánto mide el corte brunoise?', opciones: ['1 a 2 mm', '1 cm', '5 mm', '3 cm'], correcta: 0 },
  { texto: '¿Qué se pone bajo la tabla para que no se mueva?', opciones: ['Papel tela húmedo', 'Aceite', 'Sal gruesa', 'Harina'], correcta: 0 },
  { texto: '¿En qué ángulo se pasa el cuchillo por la chaira?', opciones: ['18 a 20 grados', '45 grados', '90 grados', '5 grados'], correcta: 0 },
  { texto: '¿Qué huesos lleva el fondo oscuro del video?', opciones: ['De res', 'De pollo', 'De pescado', 'De cerdo'], correcta: 0 },
  { texto: '¿Con qué se clarifica el consomé?', opciones: ['Claras y carne molida', 'Harina', 'Leche', 'Gelatina'], correcta: 0 },
  { texto: '¿Qué va en el contenedor del medio del puesto?', opciones: ['La merma', 'El producto terminado', 'El producto en bruto', 'Los cuchillos'], correcta: 0 },
  { texto: '¿Por qué lloramos al picar cebolla?', opciones: ['El cuchillo sin filo revienta las células', 'La cebolla está fría', 'Cortamos despacio', 'No la lavamos'], correcta: 0 },
  { texto: '¿Qué pasa con los huesos del fondo claro?', opciones: ['No se tuestan', 'Se tuestan mucho', 'Se fríen', 'Se congelan'], correcta: 0 },
  { texto: '¿Cuánto rinde la receta de fondo claro?', opciones: ['4 litros', '1 litro', '10 litros', '500 ml'], correcta: 0 },
  { texto: '¿Para qué va la cebolla en pluma al agua con hielo?', opciones: ['Queda crocante y suelta sulfuros', 'Se cocina', 'Cambia de color', 'Se ablanda'], correcta: 0 },
  { texto: '¿Por qué el secador debe estar seco?', opciones: ['El agua conduce el calor', 'Huele mal', 'Pesa más', 'Mancha la ropa'], correcta: 0 },
  { texto: '¿A qué fuego se cocina un fondo?', opciones: ['Bajo, sin hervir fuerte', 'Al máximo', 'En microondas', 'Sin fuego'], correcta: 0 },
  { texto: '¿Qué se hace con la espuma del fondo?', opciones: ['Se retira con un cucharón', 'Se mezcla', 'Se deja', 'Se sala'], correcta: 0 },
  { texto: '¿En qué dirección se pasa el cuchillo por la chaira?', opciones: ['Del talón a la punta', 'De la punta al talón', 'Solo por el centro', 'En círculos'], correcta: 0 },
  { texto: '¿Por qué las papas peladas van en agua?', opciones: ['Para que no se oxiden', 'Para salarlas', 'Para cocerlas', 'Para enfriarlas'], correcta: 0 },
  { texto: '¿Cuánto tarda el fondo oscuro?', opciones: ['7 horas', '50 minutos', '2 horas', '24 horas'], correcta: 0 },
  { texto: 'Con 2 litros de fondo, ¿cuánto consomé sale?', opciones: ['1 litro', '2 litros', '3 litros', '4 litros'], correcta: 0 },
  { texto: '¿Qué verduras son la base aromática del fondo claro?', opciones: ['Cebolla, zanahoria y apio', 'Papa, tomate y ajo', 'Pimiento y elote', 'Solo cebolla'], correcta: 0 },
];

export const FRASES_VF: FraseVF[] = [
  { texto: 'La brunoise es un corte de 1 a 2 milímetros.', verdadera: true },
  { texto: 'La chaira le quita el filo al cuchillo.', verdadera: false },
  { texto: 'Un trapo mojado es más seguro para tomar una olla caliente.', verdadera: false },
  { texto: 'Para el fondo claro se tuestan los huesos.', verdadera: false },
  { texto: 'El consomé se clarifica con claras de huevo.', verdadera: true },
  { texto: 'La merma útil puede servir para un fondo o una salsa.', verdadera: true },
  { texto: 'Un fondo debe hervir a fuego fuerte todo el tiempo.', verdadera: false },
  { texto: 'Dejar la raíz de la cebolla mantiene unidas sus capas.', verdadera: true },
  { texto: 'El fondo oscuro del video lleva huesos de res.', verdadera: true },
  { texto: 'Con 2 litros de fondo se obtienen 4 litros de consomé.', verdadera: false },
  { texto: 'Si eres diestro, los cuchillos van a la derecha de la tabla.', verdadera: true },
  { texto: 'La espuma del fondo se deja porque da más sabor.', verdadera: false },
];

export const PAREJAS: Pareja[] = [
  { termino: 'Brunoise', definicion: 'Cubos de 1 a 2 mm' },
  { termino: 'Chaira', definicion: 'Asienta el filo del cuchillo' },
  { termino: 'Merma', definicion: 'Lo que sobra al pelar y cortar' },
  { termino: 'Mise en place', definicion: 'Todo listo antes de cocinar' },
  { termino: 'Fondo', definicion: 'Base líquida de huesos y verduras' },
  { termino: 'Consomé', definicion: 'Caldo clarificado y transparente' },
  { termino: 'Pluma', definicion: 'Cebolla en tiras finas' },
  { termino: 'Bouquet garni', definicion: 'Hierbas atadas con hilo' },
  { termino: 'Espumar', definicion: 'Retirar impurezas de la superficie' },
  { termino: 'Mirepoix', definicion: 'Cebolla, zanahoria y apio' },
];

export const PROCEDIMIENTOS: Procedimiento[] = [
  {
    titulo: 'Fondo oscuro',
    pasos: [
      'Tostar los huesos de res hasta dorarlos',
      'Dorar las verduras',
      'Cubrir con agua fría y sumar las hierbas atadas',
      'Cocinar a fuego bajo retirando la espuma',
      'Colar el fondo',
    ],
  },
  {
    titulo: 'Consomé de pollo',
    pasos: [
      'Mezclar carne molida, verduras y claras',
      'Agregar el fondo de pollo frío',
      'Calentar despacio sin revolver',
      'Dejar que la clarificación suba y forme una capa',
      'Colar con cuidado',
    ],
  },
  {
    titulo: 'Brunoise de cebolla',
    pasos: [
      'Partir la cebolla a la mitad dejando la raíz',
      'Hacer cortes horizontales sin llegar a la raíz',
      'Hacer cortes verticales finos',
      'Cortar en sentido contrario para sacar los cubos',
    ],
  },
  {
    titulo: 'Preparar el puesto',
    pasos: [
      'Poner papel tela húmedo bajo la tabla',
      'Colocar la tabla encima',
      'Dejar los cuchillos a un lado sobre un paño',
      'Ordenar contenedores de bruto, merma y terminado',
    ],
  },
  {
    titulo: 'Usar la chaira',
    pasos: [
      'Sujetar la chaira firme y vertical',
      'Apoyar el talón del cuchillo a 18 o 20 grados',
      'Deslizar del talón a la punta',
      'Repetir del otro lado de la hoja',
    ],
  },
];

/** Devuelve una copia mezclada (Fisher-Yates). */
export function mezclar<T>(lista: readonly T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
