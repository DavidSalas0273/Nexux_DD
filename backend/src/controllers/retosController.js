const {
  getRetosConEstado,
  getRetoActivo,
  yaCompleto,
  completarReto,
  getXpUsuario,
} = require('../queries/retosQueries');
const { getRanking } = require('../queries/xpQueries');

// Porcentaje mínimo de aciertos para ganar el XP de un reto
const MINIMO_ACIERTOS = 0.6;

// GET /api/retos — retos diarios y semanales con el estado del usuario, y su XP total
async function getRetos(req, res) {
  try {
    const [retos, xpTotal] = await Promise.all([
      getRetosConEstado(req.userId),
      getXpUsuario(req.userId),
    ]);
    res.json({
      diarios: retos.filter((r) => r.tipo === 'diario'),
      semanales: retos.filter((r) => r.tipo === 'semanal'),
      xpTotal,
    });
  } catch (error) {
    console.error('[getRetos]', error.message);
    res.status(500).json({ error: 'Error al obtener retos' });
  }
}

// POST /api/retos/:id/completar — body: { aciertos, total }
async function completar(req, res) {
  try {
    const retoId = Number.parseInt(req.params.id, 10);
    const aciertos = Number(req.body?.aciertos);
    const total = Number(req.body?.total);

    if (!Number.isInteger(retoId)) {
      return res.status(400).json({ error: 'Reto inválido' });
    }
    if (!Number.isInteger(aciertos) || !Number.isInteger(total) || total < 1 || aciertos < 0 || aciertos > total) {
      return res.status(400).json({ error: 'Resultado del juego inválido' });
    }
    if (aciertos / total < MINIMO_ACIERTOS) {
      return res.status(400).json({ error: 'Necesitas al menos 60% de aciertos para ganar el XP' });
    }

    const reto = await getRetoActivo(retoId);
    if (!reto) {
      return res.status(404).json({ error: 'Reto no encontrado' });
    }

    if (await yaCompleto(req.userId, retoId)) {
      return res.status(409).json({ error: 'Ya completaste este reto en el periodo actual' });
    }

    const xpTotal = await completarReto(req.userId, reto);
    res.json({ message: 'Reto completado', xpGanado: reto.xp, xpTotal });
  } catch (error) {
    console.error('[completar]', error.message);
    res.status(500).json({ error: 'Error al completar reto' });
  }
}

function conPosicion(jugadores, usuarioId) {
  return jugadores.map((j, i) => ({
    posicion: i + 1,
    id: j.id,
    nombre: j.nombre,
    foto: j.foto,
    xp: Number(j.xp),
    xpTotal: Number(j.xp_total),
    esUsuario: j.id === usuarioId,
  }));
}

// GET /api/retos/ranking/diario — XP ganado hoy (lecciones + retos)
async function rankingDiario(req, res) {
  try {
    res.json(conPosicion(await getRanking('diario'), req.userId));
  } catch (error) {
    console.error('[rankingDiario]', error.message);
    res.status(500).json({ error: 'Error al obtener ranking diario' });
  }
}

// GET /api/retos/ranking/semanal — XP ganado desde el lunes (lecciones + retos)
async function rankingSemanal(req, res) {
  try {
    res.json(conPosicion(await getRanking('semanal'), req.userId));
  } catch (error) {
    console.error('[rankingSemanal]', error.message);
    res.status(500).json({ error: 'Error al obtener ranking semanal' });
  }
}

module.exports = { getRetos, completar, rankingDiario, rankingSemanal };
