const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getProgress, saveProgress } = require('../controllers/progressController');

const router = express.Router();

// Todas las rutas de progreso requieren autenticación
router.get('/', authMiddleware, getProgress);
router.post('/', authMiddleware, saveProgress);

module.exports = router;
