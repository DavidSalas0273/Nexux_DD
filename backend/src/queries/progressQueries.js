const pool = require('../config/database');

/**
 * Crea la tabla de progreso si no existe.
 * Se llama al arrancar el servidor para no depender de volver a correr init-db.
 */
async function ensureProgressTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS progreso_niveles (
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      nivel_id INTEGER NOT NULL,
      mejor_puntaje INTEGER NOT NULL DEFAULT 0,
      total_preguntas INTEGER NOT NULL DEFAULT 0,
      completado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (usuario_id, nivel_id)
    );
  `);
}

async function getProgressByUser(usuarioId) {
  const result = await pool.query(
    `SELECT nivel_id, mejor_puntaje, total_preguntas, completado_at
     FROM progreso_niveles
     WHERE usuario_id = $1
     ORDER BY nivel_id`,
    [usuarioId]
  );
  return result.rows;
}

/**
 * Marca un nivel como completado. Si ya existía, conserva el mejor puntaje.
 */
async function saveLevelProgress(usuarioId, nivelId, puntaje, total) {
  const result = await pool.query(
    `INSERT INTO progreso_niveles (usuario_id, nivel_id, mejor_puntaje, total_preguntas)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (usuario_id, nivel_id) DO UPDATE
       SET mejor_puntaje = GREATEST(progreso_niveles.mejor_puntaje, EXCLUDED.mejor_puntaje),
           total_preguntas = EXCLUDED.total_preguntas
     RETURNING nivel_id, mejor_puntaje, total_preguntas, completado_at`,
    [usuarioId, nivelId, puntaje, total]
  );
  return result.rows[0];
}

module.exports = {
  ensureProgressTable,
  getProgressByUser,
  saveLevelProgress,
};
