// authMiddleware.js

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta_super_segura';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    console.log('Middleware - Error: No se proporcionó un token.');
    return res.status(401).json({ error: 'Acceso denegado. No hay token.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    req.user = decoded;
    console.log("Middleware - Usuario autenticado:", req.user); // Log para verificar el contenido del token decodificado
    next();
  } catch (err) {
    console.log('Middleware - Error: Token inválido o expirado:', err.message);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;