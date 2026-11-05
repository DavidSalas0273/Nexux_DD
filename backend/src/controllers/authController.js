const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../queries/userQueries');

/**
 * POST /api/auth/register
 * Body: { nombre, correo, password, foto (opcional) }
 */
async function register(req, res) {
  try {
    const { nombre, correo, password } = req.body;
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
    }

    // Verificar si el correo ya está registrado
    const existingUser = await findUserByEmail(correo);
    if (existingUser) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario
    const user = await createUser({
      nombre,
      correo,
      password: hashedPassword,
      foto,
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, correo: user.correo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        foto: user.foto,
      },
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * POST /api/auth/login
 * Body: { correo, password }
 */
async function login(req, res) {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    // Buscar el usuario por correo
    const user = await findUserByEmail(correo);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, correo: user.correo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        foto: user.foto,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { register, login };
