const pool = require('../config/database');
const { registrarXp } = require('./xpQueries');

// Periodo al que pertenece un reto: el día de hoy o el lunes de esta semana (según la hora de la base de datos)
const PERIODO_SQL = `CASE WHEN r.tipo = 'diario' THEN CURRENT_DATE ELSE date_trunc('week', CURRENT_DATE)::date END`;

/**
 * Retos jugables. "juego" indica qué minijuego abre el frontend:
 *  relampago  → preguntas rápidas con tiempo
 *  vf         → verdadero o falso
 *  parejas    → unir conceptos con su definición
 *  ordenar    → ordenar los pasos de una preparación
 *  maraton    → versión larga del quiz relámpago
 *  ordenar3   → tres rondas de ordenar pasos
 */
const RETOS_JUEGOS = [
  ['Quiz relámpago',      'Responde 6 preguntas antes de que se acabe el tiempo',          'rayo',    30,  'diario',  'relampago'],
  ['Verdadero o falso',   'Decide rápido si cada frase de cocina es cierta o no',           'balanza', 20,  'diario',  'vf'],
  ['Empareja conceptos',  'Une cada técnica con lo que significa',                          'parejas', 25,  'diario',  'parejas'],
  ['Ordena la receta',    'Pon en orden los pasos de una preparación',                      'lista',   35,  'diario',  'ordenar'],
  ['Maratón de cocina',   'Responde 12 preguntas seguidas con menos tiempo por pregunta',   'trofeo',  120, 'semanal', 'maraton'],
  ['Chef ordenado',       'Ordena los pasos de tres preparaciones distintas',               'gorro',   100, 'semanal', 'ordenar3'],
];

/**
 * Prepara la tabla de retos para los minijuegos.
 * Si todavía no hay retos con juego, desactiva los antiguos (sin borrarlos) y crea los nuevos.
 */
async function ensureRetosJuegos() {
  await pool.query(`
    ALTER TABLE retos ADD COLUMN IF NOT EXISTS juego VARCHAR(20);
    ALTER TABLE retos ALTER COLUMN icono TYPE VARCHAR(30);
  `);

  const existentes = await pool.query(`SELECT COUNT(*)::int AS n FROM retos WHERE juego IS NOT NULL`);
  if (existentes.rows[0].n > 0) return;

  await pool.query(`UPDATE retos SET activo = false WHERE juego IS NULL`);
  for (const [titulo, descripcion, icono, xp, tipo, juego] of RETOS_JUEGOS) {
    await pool.query(
      `INSERT INTO retos (titulo, descripcion, icono, xp, tipo, categoria, juego)
       VALUES ($1, $2, $3, $4, $5, 'juego', $6)`,
      [titulo, descripcion, icono, xp, tipo, juego]
    );
  }
}

// Retos activos con la marca de si el usuario ya los completó en el periodo actual
async function getRetosConEstado(usuarioId) {
  const result = await pool.query(
    `SELECT
       r.id, r.titulo, r.descripcion, r.icono, r.xp, r.tipo, r.categoria, r.juego,
       (ur.id IS NOT NULL) AS completado
     FROM retos r
     LEFT JOIN usuario_retos ur
       ON ur.reto_id = r.id
      AND ur.usuario_id = $1
      AND ur.periodo = ${PERIODO_SQL}
     WHERE r.activo = true
     ORDER BY r.tipo, r.xp ASC, r.id`,
    [usuarioId]
  );
  return result.rows;
}

async function getRetoActivo(retoId) {
  const result = await pool.query(`SELECT * FROM retos WHERE id = $1 AND activo = true`, [retoId]);
  return result.rows[0] || null;
}

// ¿El usuario ya completó este reto en el periodo actual?
async function yaCompleto(usuarioId, retoId) {
  const result = await pool.query(
    `SELECT ur.id
     FROM usuario_retos ur
     JOIN retos r ON r.id = ur.reto_id
     WHERE ur.usuario_id = $1 AND ur.reto_id = $2 AND ur.periodo = ${PERIODO_SQL}`,
    [usuarioId, retoId]
  );
  return result.rows.length > 0;
}

// Registra el reto completado y suma su XP. Devuelve el XP total del usuario.
async function completarReto(usuarioId, reto) {
  await pool.query(
    `INSERT INTO usuario_retos (usuario_id, reto_id, periodo)
     SELECT $1, r.id, ${PERIODO_SQL} FROM retos r WHERE r.id = $2`,
    [usuarioId, reto.id]
  );
  return registrarXp(usuarioId, 'reto', reto.id, reto.xp);
}

async function getXpUsuario(usuarioId) {
  const result = await pool.query(`SELECT COALESCE(xp, 0) AS xp FROM usuarios WHERE id = $1`, [usuarioId]);
  return result.rows[0]?.xp ?? 0;
}

module.exports = {
  ensureRetosJuegos,
  getRetosConEstado,
  getRetoActivo,
  yaCompleto,
  completarReto,
  getXpUsuario,
};
