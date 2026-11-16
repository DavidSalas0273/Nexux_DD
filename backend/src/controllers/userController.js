const {
  METAS_DIARIAS,
  findUserById,
  updateUserProfile,
  getProfileSummary,
} = require('../queries/userQueries');

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

/**
 * GET /api/users/profile/resumen
 * Datos del perfil, estadísticas y actividad de los últimos 7 días.
 */
async function getResumen(req, res) {
  try {
    const resumen = await getProfileSummary(req.userId);
    if (!resumen) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(resumen);
  } catch (error) {
    console.error('Error en getResumen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/users/profile  (multipart/form-data)
 * Campos opcionales: nombre, bio, metaDiaria, foto (archivo)
 */
async function updateProfile(req, res) {
  try {
    const cambios = {};

    if (req.body.nombre !== undefined) {
      const nombre = String(req.body.nombre).trim();
      if (nombre.length < 2 || nombre.length > 100) {
        return res.status(400).json({ error: 'El nombre debe tener entre 2 y 100 caracteres' });
      }
      cambios.nombre = nombre;
    }

    if (req.body.bio !== undefined) {
      const bio = String(req.body.bio).trim();
      if (bio.length > 160) {
        return res.status(400).json({ error: 'La descripción puede tener hasta 160 caracteres' });
      }
      cambios.bio = bio;
    }

    if (req.body.metaDiaria !== undefined) {
      const meta = Number(req.body.metaDiaria);
      if (!METAS_DIARIAS.includes(meta)) {
        return res.status(400).json({ error: 'Meta diaria inválida' });
      }
      cambios.metaDiaria = meta;
    }

    if (req.file) {
      cambios.foto = `/uploads/${req.file.filename}`;
    }

    const user = await updateUserProfile(req.userId, cambios);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        foto: user.foto,
      },
      bio: user.bio,
      metaDiaria: user.meta_diaria,
    });
  } catch (error) {
    console.error('Error en updateProfile:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { getProfile, getResumen, updateProfile };
