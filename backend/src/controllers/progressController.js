const { getProgressByUser, saveLevelProgress } = require('../queries/progressQueries');

/**
 * GET /api/progress
 * Devuelve los niveles completados por el usuario autenticado.
 */
async function getProgress(req, res) {
  try {
    const niveles = await getProgressByUser(req.userId);
    res.json({ niveles });
  } catch (error) {
    console.error('Error en getProgress:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/progress
 * Body: { nivelId, puntaje, total }
 */
async function saveProgress(req, res) {
  const nivelId = Number(req.body.nivelId);
  const puntaje = Number(req.body.puntaje);
  const total = Number(req.body.total);

  const valido = (n) => Number.isInteger(n) && n >= 0;
  if (!valido(nivelId) || nivelId < 1 || !valido(puntaje) || !valido(total) || puntaje > total) {
    return res.status(400).json({ error: 'Datos de progreso inválidos' });
  }

  try {
    const nivel = await saveLevelProgress(req.userId, nivelId, puntaje, total);
    res.json({ nivel });
  } catch (error) {
    console.error('Error en saveProgress:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { getProgress, saveProgress };
