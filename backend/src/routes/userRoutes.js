const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/userController');

const router = express.Router();

// GET /api/users/profile - requiere autenticación
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
