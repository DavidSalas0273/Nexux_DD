const multer = require('multer');
const path = require('path');

/**
 * Subida de fotos de perfil (registro y edición de perfil).
 * Guarda en /uploads con un nombre único. Máximo 5 MB; solo imágenes.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
  },
});

const uploadFoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      const error = new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)');
      error.status = 400;
      cb(error);
    }
  },
});

module.exports = uploadFoto;
