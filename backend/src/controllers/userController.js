const { findUserById } = require('../queries/userQueries');

/**
 * GET /api/users/profile
 * Requiere token JWT en el header: Authorization: Bearer <token>
 */
async function getProfile(req, res) {
  try {
    const user = await findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { getProfile };
