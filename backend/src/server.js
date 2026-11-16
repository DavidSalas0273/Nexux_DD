const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Crear la carpeta uploads si no existe
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const pool = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const progressRoutes = require('./routes/progressRoutes');
const retosRoutes    = require('./routes/retosRoutes');
const { ensureProgressTable } = require('./queries/progressQueries');
const { ensureXpTable } = require('./queries/xpQueries');
const { ensureRetosJuegos } = require('./queries/retosQueries');
const { ensureProfileColumns } = require('./queries/userQueries');

const app = express();

// Verificar conexión a PostgreSQL al arrancar
pool.query('SELECT 1')
  .then(() => console.log('✅ Conectado a PostgreSQL correctamente'))
  .then(() => ensureProgressTable())
  .then(() => ensureXpTable())
  .then(() => ensureRetosJuegos())
  .then(() => ensureProfileColumns())
  .catch((err) => console.error('❌ Error al conectar a PostgreSQL:', err.message));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/retos',    retosRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nexus DD API is running' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  // Errores de subida de archivos (tipo o tamaño no válido) son errores del cliente
  if (err.name === 'MulterError') {
    const mensaje = err.code === 'LIMIT_FILE_SIZE' ? 'La imagen no puede pesar más de 5 MB' : err.message;
    return res.status(400).json({ error: mensaje });
  }
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
