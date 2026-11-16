const pool = require('../config/database');

// Obtener todos los retos activos con flag de si el usuario ya los completó hoy/esta semana
async function getRetosConEstado(usuarioId) {
  const hoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const inicioSemana = getInicioSemana();

  const result = await pool.query(
    `SELECT
       r.id, r.titulo, r.descripcion, r.icono, r.xp, r.tipo, r.categoria,
       CASE
         WHEN r.tipo = 'diario'   AND ur.id IS NOT NULL THEN true
         WHEN r.tipo = 'semanal'  AND ur.id IS NOT NULL THEN true
         ELSE false
       END AS completado
     FROM retos r
     LEFT JOIN usuario_retos ur
       ON ur.reto_id = r.id
       AND ur.usuario_id = $1
       AND (
         (r.tipo = 'diario'  AND ur.periodo = $2)
         OR
         (r.tipo = 'semanal' AND ur.periodo = $3)
       )
     WHERE r.activo = true
     ORDER BY r.tipo, r.xp DESC`,
    [usuarioId, hoy, inicioSemana]
  );

  return result.rows;
}

// Verificar si el usuario ya completó el reto en el periodo actual
async function yaCompleto(usuarioId, retoId, tipo) {
  const periodo = tipo === 'diario' ? new Date().toISOString().split('T')[0] : getInicioSemana();
  const result = await pool.query(
    `SELECT id FROM usuario_retos WHERE usuario_id=$1 AND reto_id=$2 AND periodo=$3`,
    [usuarioId, retoId, periodo]
  );
  return result.rows.length > 0;
}

// Registrar reto completado y sumar XP al usuario
async function completarReto(usuarioId, retoId, xp, tipo) {
  const periodo = tipo === 'diario' ? new Date().toISOString().split('T')[0] : getInicioSemana();

  // Insertar registro de completado
  await pool.query(
    `INSERT INTO usuario_retos (usuario_id, reto_id, periodo) VALUES ($1, $2, $3)`,
    [usuarioId, retoId, periodo]
  );

  // Sumar XP al usuario
  const result = await pool.query(
    `UPDATE usuarios SET xp = xp + $1 WHERE id = $2 RETURNING xp`,
    [xp, usuarioId]
  );

  return result.rows[0].xp;
}

// Obtener XP y diamantes del usuario
async function getStatsUsuario(usuarioId) {
  const result = await pool.query(
    `SELECT xp, diamantes FROM usuarios WHERE id = $1`,
    [usuarioId]
  );
  return result.rows[0] || { xp: 0, diamantes: 0 };
}

// Ranking diario (por XP sumado hoy)
async function getRankingDiario() {
  const hoy = new Date().toISOString().split('T')[0];
  const result = await pool.query(
    `SELECT
       u.id, u.nombre, u.foto,
       COALESCE(SUM(r.xp), 0) AS xp
     FROM usuarios u
     LEFT JOIN usuario_retos ur ON ur.usuario_id = u.id AND ur.periodo = $1
     LEFT JOIN retos r ON r.id = ur.reto_id AND r.tipo = 'diario'
     GROUP BY u.id, u.nombre, u.foto
     ORDER BY xp DESC
     LIMIT 20`,
    [hoy]
  );
  return result.rows;
}

// Ranking semanal (por XP sumado en la semana)
async function getRankingSemanal() {
  const inicioSemana = getInicioSemana();
  const result = await pool.query(
    `SELECT
       u.id, u.nombre, u.foto, u.diamantes,
       COALESCE(SUM(r.xp), 0) AS xp
     FROM usuarios u
     LEFT JOIN usuario_retos ur ON ur.usuario_id = u.id AND ur.periodo >= $1
     LEFT JOIN retos r ON r.id = ur.reto_id
     GROUP BY u.id, u.nombre, u.foto, u.diamantes
     ORDER BY xp DESC
     LIMIT 20`,
    [inicioSemana]
  );
  return result.rows;
}

// Calcular el lunes de la semana actual
function getInicioSemana() {
  const hoy = new Date();
  const dia = hoy.getDay(); // 0=dom, 1=lun...
  const diff = (dia === 0 ? -6 : 1 - dia);
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diff);
  return lunes.toISOString().split('T')[0];
}

module.exports = {
  getRetosConEstado,
  yaCompleto,
  completarReto,
  getStatsUsuario,
  getRankingDiario,
  getRankingSemanal,
};
