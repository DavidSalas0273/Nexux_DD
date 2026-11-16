const pool = require('../config/database');
const { ensureXpTable } = require('../queries/xpQueries');
const { ensureRetosJuegos } = require('../queries/retosQueries');

async function initDatabase() {
  try {
    console.log('Conectando a PostgreSQL...');

    // Crear tabla de usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        foto VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tabla "usuarios" creada correctamente');

    // Crear tabla de progreso de niveles (Aprender)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS progreso_niveles (
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        nivel_id INTEGER NOT NULL,
        mejor_puntaje INTEGER NOT NULL DEFAULT 0,
        total_preguntas INTEGER NOT NULL DEFAULT 0,
        completado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (usuario_id, nivel_id)
      );
    `);
    console.log('Tabla "progreso_niveles" creada correctamente');

    // Agregar columnas xp y diamantes a usuarios si no existen
    await pool.query(`
      ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
      ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS diamantes INTEGER DEFAULT 0;
    `);
    console.log('Columnas "xp" y "diamantes" en usuarios OK');

    // Tabla de retos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS retos (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        descripcion VARCHAR(500) NOT NULL,
        icono VARCHAR(10) NOT NULL,
        xp INTEGER NOT NULL,
        tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('diario', 'semanal')),
        categoria VARCHAR(50) DEFAULT 'general',
        activo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla "retos" creada correctamente');

    // Tabla de retos completados por usuario
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario_retos (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        reto_id INTEGER REFERENCES retos(id) ON DELETE CASCADE,
        completado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        periodo DATE NOT NULL,
        UNIQUE(usuario_id, reto_id, periodo)
      );
    `);
    console.log('Tabla "usuario_retos" creada correctamente');

    // Tabla de ranking de diamantes semanal
    await pool.query(`
      CREATE TABLE IF NOT EXISTS diamantes_ranking (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        semana DATE NOT NULL,
        posicion INTEGER NOT NULL,
        diamantes INTEGER NOT NULL,
        entregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(usuario_id, semana)
      );
    `);
    console.log('Tabla "diamantes_ranking" creada correctamente');

    // Retos como minijuegos (columna "juego") y registro de XP para el ranking
    await pool.query(`
      ALTER TABLE retos ADD COLUMN IF NOT EXISTS juego VARCHAR(20);
      ALTER TABLE retos ALTER COLUMN icono TYPE VARCHAR(30);
    `);
    await ensureXpTable();
    console.log('Tabla "xp_eventos" creada correctamente');

    // Insertar retos base (limpia e inserta para tener siempre los datos frescos)
    await pool.query(`DELETE FROM retos;`);
    await ensureRetosJuegos();
    console.log('Retos de minijuegos insertados correctamente (6 retos)');

    console.log('✅ Base de datos inicializada con éxito');

    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
    process.exit(1);
  }
}

initDatabase();
