const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getRetos,
  completar,
  rankingDiario,
  rankingSemanal,
} = require('../controllers/retosController');

const router = express.Router();

// Todas las rutas requieren JWT
router.get('/',                authMiddleware, getRetos);
router.post('/:id/completar',  authMiddleware, completar);
router.get('/ranking/diario',  authMiddleware, rankingDiario);
router.get('/ranking/semanal', authMiddleware, rankingSemanal);

module.exports = router;
