const {
  getRetosConEstado,
  yaCompleto,
  completarReto,
  getStatsUsuario,
  getRankingDiario,
  getRankingSemanal,
} = require('../queries/retosQueries');

// GET /api/retos  — devuelve retos diarios y semanales con estado del usuario
async function getRetos(req, res) {
  try {
    const retos = await getRetosConEstado(req.userId);
    const diarios   = retos.filter(r => r.tipo === 'diario');
    const semanales = retos.filter(r => r.tipo === 'semanal');
    res.json({ diarios, semanales });
  } catch (error) {
    console.error('[getRetos]', error.message);
    res.status(500).json({ error: 'Error al obtener retos' });
  }
}

// POST /api/retos/:id/completar
async function completar(req, res) {
  try {
    const retoId = parseInt(req.params.id);
    const usuarioId = req.userId;

    // Buscar el reto en la DB
    const pool = require('../config/database');
    const retoResult = await pool.query('SELECT * FROM retos WHERE id = $1 AND activo = true', [retoId]);
    if (retoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Reto no encontrado' });
    }
    const reto = retoResult.rows[0];

    // Verificar si ya lo completó
    const completado = await yaCompleto(usuarioId, retoId, reto.tipo);
    if (completado) {
      return res.status(409).json({ error: 'Ya completaste este reto en el periodo actual' });
    }

    // Registrar y sumar XP
    const xpTotal = await completarReto(usuarioId, retoId, reto.xp, reto.tipo);

    res.json({
      message: 'Reto completado',
      xpGanado: reto.xp,
      xpTotal,
    });
  } catch (error) {
    console.error('[completar]', error.message);
    res.status(500).json({ error: 'Error al completar reto' });
  }
}

// GET /api/retos/ranking/diario
async function rankingDiario(req, res) {
  try {
    const jugadores = await getRankingDiario();
    const conPosicion = jugadores.map((j, i) => ({
      posicion: i + 1,
      id: j.id,
      nombre: j.nombre,
      foto: j.foto,
      xp: parseInt(j.xp),
      diamantes: parseInt(j.diamantes ?? 0),
      premioDiamantes: 0,
      esUsuario: j.id === req.userId,
    }));
    res.json(conPosicion);
  } catch (error) {
    console.error('[rankingDiario]', error.message);
    res.status(500).json({ error: 'Error al obtener ranking diario' });
  }
}

// GET /api/retos/ranking/semanal
async function rankingSemanal(req, res) {
  try {
    const jugadores = await getRankingSemanal();
    // Premios de diamantes: top3 recibe 10, 7, 5
    const premios = [10, 7, 5];
    const conPosicion = jugadores.map((j, i) => ({
      posicion: i + 1,
      id: j.id,
      nombre: j.nombre,
      foto: j.foto,
      xp: parseInt(j.xp),
      diamantes: parseInt(j.diamantes ?? 0),
      premioDiamantes: premios[i] ?? 0,
      esUsuario: j.id === req.userId,
    }));
    res.json(conPosicion);
  } catch (error) {
    console.error('[rankingSemanal]', error.message);
    res.status(500).json({ error: 'Error al obtener ranking semanal' });
  }
}

// GET /api/retos/mis-diamantes
async function misDiamantes(req, res) {
  try {
    const stats = await getStatsUsuario(req.userId);
    res.json({ diamantes: stats.diamantes ?? 0 });
  } catch (error) {
    console.error('[misDiamantes]', error.message);
    res.status(500).json({ error: 'Error al obtener diamantes' });
  }
}

module.exports = { getRetos, completar, rankingDiario, rankingSemanal, misDiamantes };
