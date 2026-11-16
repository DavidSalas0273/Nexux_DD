const pool = require('../config/database');

/**
 * Registro de todo el XP que gana cada usuario (lecciones y retos).
 * El ranking diario y semanal se calcula sumando estos eventos por fecha.
 */
async function ensureXpTable() {
  await pool.query(`
    ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;

    CREATE TABLE IF NOT EXISTS xp_eventos (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      origen VARCHAR(20) NOT NULL,
      referencia INTEGER,
      xp INTEGER NOT NULL,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_xp_eventos_fecha ON xp_eventos (creado_en, usuario_id);
  `);
}

/**
 * Suma XP a un usuario y deja el evento registrado.
 * @param {'leccion'|'reto'} origen
 * @returns {Promise<number>} XP total acumulado del usuario
 */
async function registrarXp(usuarioId, origen, referencia, xp) {
  await pool.query(
    `INSERT INTO xp_eventos (usuario_id, origen, referencia, xp) VALUES ($1, $2, $3, $4)`,
    [usuarioId, origen, referencia, xp]
  );
  const result = await pool.query(
    `UPDATE usuarios SET xp = COALESCE(xp, 0) + $1 WHERE id = $2 RETURNING xp`,
    [xp, usuarioId]
  );
  return result.rows[0]?.xp ?? 0;
}

/**
 * Ranking por XP ganado desde una fecha. Incluye a todos los usuarios
 * (los que no han ganado XP en el periodo aparecen con 0).
 * @param {'diario'|'semanal'} periodo
 */
async function getRanking(periodo) {
  const desde = periodo === 'diario' ? `CURRENT_DATE` : `date_trunc('week', CURRENT_DATE)`;
  const result = await pool.query(
    `SELECT
       u.id, u.nombre, u.foto,
       COALESCE(u.xp, 0) AS xp_total,
       COALESCE(SUM(e.xp), 0) AS xp
     FROM usuarios u
     LEFT JOIN xp_eventos e ON e.usuario_id = u.id AND e.creado_en >= ${desde}
     GROUP BY u.id, u.nombre, u.foto, u.xp
     ORDER BY xp DESC, xp_total DESC, u.nombre ASC
     LIMIT 30`
  );
  return result.rows;
}

module.exports = { ensureXpTable, registrarXp, getRanking };
