const pool = require('../config/database');

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

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
