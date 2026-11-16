const pool = require('../config/database');

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

    // Insertar retos base (limpia e inserta para tener siempre los datos frescos)
    await pool.query(`DELETE FROM retos;`);
    await pool.query(`
      INSERT INTO retos (titulo, descripcion, icono, xp, tipo, categoria) VALUES
        ('Practica un corte básico',       'Completa la lección de cortes de la unidad Fundamentos',                       '🔪', 40,  'diario',   'fundamentos'),
        ('Prepara una ensalada',           'Termina la lección de ensaladas y guarniciones',                               '🥗', 30,  'diario',   'fundamentos'),
        ('Domina la sartén',               'Completa la lección de técnicas en sartén de Fundamentos',                     '🍳', 35,  'diario',   'fundamentos'),
        ('Prueba la bechamel',             'Avanza en la lección de salsas madre con bechamel',                            '🌿', 50,  'diario',   'salsas'),
        ('Cocina una salsa de tomate',     'Completa la lección de salsa de tomate en Salsas madre',                       '🍲', 50,  'diario',   'salsas'),
        ('Racha sin errores',              'Responde correctamente todas las preguntas de una lección de hoy',             '🎯', 25,  'diario',   'general'),
        ('Velocista',                      'Responde 3 preguntas seguidas en menos de 5 segundos cada una',                '⚡', 20,  'diario',   'general'),
        ('Maestro de Fundamentos',         'Completa todas las lecciones de la unidad Fundamentos esta semana',            '🏆', 200, 'semanal',  'fundamentos'),
        ('Experto en salsas madre',        'Completa toda la unidad de Salsas madre: bechamel, tomate y vinagreta',        '🍲', 180, 'semanal',  'salsas'),
        ('Inicio en Proteínas',            'Desbloquea y completa la primera lección de la unidad Proteínas',              '🥩', 120, 'semanal',  'proteinas'),
        ('Sin errores 5 días',             'Completa al menos una lección sin fallos durante 5 días distintos',            '🎯', 150, 'semanal',  'general'),
        ('Constancia semanal',             'Entra a la app y completa al menos un reto diario 5 días de la semana',        '📅', 100, 'semanal',  'general'),
        ('Chef en formación',              'Acumula 150 XP o más completando retos diarios esta semana',                   '👨‍🍳', 130, 'semanal',  'general');
    `);
    console.log('Retos base insertados correctamente (13 retos)');

    console.log('✅ Base de datos inicializada con éxito');

    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
    process.exit(1);
  }
}

initDatabase();
