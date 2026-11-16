const express = require('express');
const uploadFoto = require('../middleware/uploadFoto');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
router.post('/register', uploadFoto.single('foto'), register);

// POST /api/auth/login
router.post('/login', login);

module.exports = router;
