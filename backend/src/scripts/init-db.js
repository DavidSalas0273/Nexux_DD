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
    console.log('Base de datos inicializada con éxito');

    process.exit(0);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
    process.exit(1);
  }
}

initDatabase();
