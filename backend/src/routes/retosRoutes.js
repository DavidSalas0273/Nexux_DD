const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getRetos,
  completar,
  rankingDiario,
  rankingSemanal,
  misDiamantes,
} = require('../controllers/retosController');

const router = express.Router();

// Todas las rutas requieren JWT
router.get('/',                    authMiddleware, getRetos);
router.post('/:id/completar',      authMiddleware, completar);
router.get('/ranking/diario',      authMiddleware, rankingDiario);
router.get('/ranking/semanal',     authMiddleware, rankingSemanal);
router.get('/mis-diamantes',       authMiddleware, misDiamantes);

module.exports = router;
