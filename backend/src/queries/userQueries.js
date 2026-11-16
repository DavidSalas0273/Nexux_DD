const pool = require('../config/database');

// Metas diarias de XP que el usuario puede elegir en su perfil
const METAS_DIARIAS = [10, 20, 30, 50];

/**
 * Columnas del perfil editable. Se crean al arrancar el servidor si no existen.
 */
async function ensureProfileColumns() {
  await pool.query(`
    ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS bio VARCHAR(160);
    ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS meta_diaria INTEGER DEFAULT 20;
  `);
}

async function createUser({ nombre, correo, password, foto }) {
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, correo, password, foto)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, correo, foto, created_at`,
    [nombre, correo, password, foto]
  );
  return result.rows[0];
}

async function findUserByEmail(correo) {
  const result = await pool.query(
    `SELECT * FROM usuarios WHERE correo = $1`,
    [correo]
  );
  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await pool.query(
    `SELECT id, nombre, correo, foto, created_at FROM usuarios WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

/**
 * Actualiza solo los campos que llegan (los undefined no se tocan).
 */
async function updateUserProfile(id, { nombre, bio, metaDiaria, foto }) {
  const result = await pool.query(
    `UPDATE usuarios SET
       nombre      = COALESCE($2, nombre),
       bio         = CASE WHEN $3::text IS NULL THEN bio ELSE NULLIF($3, '') END,
       meta_diaria = COALESCE($4, meta_diaria),
       foto        = COALESCE($5, foto)
     WHERE id = $1
     RETURNING id, nombre, correo, foto, bio, meta_diaria, created_at`,
    [id, nombre ?? null, bio ?? null, metaDiaria ?? null, foto ?? null]
  );
  return result.rows[0] || null;
}

/**
 * Todo lo que muestra la página de perfil en una sola consulta por bloque.
 */
async function getProfileSummary(id) {
  const [usuario, lecciones, retos, actividad, dias, semana] = await Promise.all([
    pool.query(
      `SELECT id, nombre, correo, foto, bio, COALESCE(meta_diaria, 20) AS meta_diaria,
              COALESCE(xp, 0) AS xp, created_at
       FROM usuarios WHERE id = $1`,
      [id]
    ),
    pool.query(
      `SELECT COUNT(*)::int AS completadas,
              COUNT(*) FILTER (WHERE mejor_puntaje = total_preguntas AND total_preguntas > 0)::int AS perfectas
       FROM progreso_niveles WHERE usuario_id = $1`,
      [id]
    ),
    pool.query(`SELECT COUNT(*)::int AS completados FROM usuario_retos WHERE usuario_id = $1`, [id]),
    pool.query(
      `SELECT to_char(d, 'YYYY-MM-DD') AS fecha, COALESCE(SUM(e.xp), 0)::int AS xp
       FROM generate_series(CURRENT_DATE - 6, CURRENT_DATE, interval '1 day') AS d
       LEFT JOIN xp_eventos e ON e.usuario_id = $1 AND e.creado_en::date = d::date
       GROUP BY d
       ORDER BY d`,
      [id]
    ),
    pool.query(
      `SELECT COUNT(DISTINCT creado_en::date)::int AS dias FROM xp_eventos WHERE usuario_id = $1`,
      [id]
    ),
    pool.query(
      `SELECT posicion FROM (
         SELECT u.id, RANK() OVER (ORDER BY COALESCE(SUM(e.xp), 0) DESC) AS posicion
         FROM usuarios u
         LEFT JOIN xp_eventos e ON e.usuario_id = u.id AND e.creado_en >= date_trunc('week', CURRENT_DATE)
         GROUP BY u.id
       ) r WHERE r.id = $1`,
      [id]
    ),
  ]);

  const u = usuario.rows[0];
  if (!u) return null;

  return {
    usuario: {
      id: u.id,
      nombre: u.nombre,
      correo: u.correo,
      foto: u.foto,
      bio: u.bio,
      metaDiaria: u.meta_diaria,
      creadoEn: u.created_at,
    },
    xpTotal: u.xp,
    leccionesCompletadas: lecciones.rows[0].completadas,
    leccionesPerfectas: lecciones.rows[0].perfectas,
    retosCompletados: retos.rows[0].completados,
    diasActivos: dias.rows[0].dias,
    posicionSemanal: Number(semana.rows[0]?.posicion ?? 0),
    actividad: actividad.rows.map((r) => ({ fecha: r.fecha, xp: r.xp })),
  };
}

module.exports = {
  METAS_DIARIAS,
  ensureProfileColumns,
  createUser,
  findUserByEmail,
  findUserById,
  updateUserProfile,
  getProfileSummary,
};
