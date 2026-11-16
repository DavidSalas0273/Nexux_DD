const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const uploadFoto = require('../middleware/uploadFoto');
const { getProfile, getResumen, updateProfile } = require('../controllers/userController');

const router = express.Router();

// GET /api/users/profile - requiere autenticación
router.get('/profile', authMiddleware, getProfile);

// GET /api/users/profile/resumen - estadísticas, actividad y logros del perfil
router.get('/profile/resumen', authMiddleware, getResumen);

// PUT /api/users/profile - edita nombre, bio, meta diaria y foto (multipart/form-data)
router.put('/profile', authMiddleware, uploadFoto.single('foto'), updateProfile);

module.exports = router;
