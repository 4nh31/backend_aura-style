const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secretKey = 'tu_secreto_super_seguro'; // 🔒 Cámbialo por una variable de entorno

class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    try {
      // Buscar el usuario en la base de datos
      const [users] = await db.query('SELECT * FROM usuario WHERE correo = ?', [email]);

      if (users.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      const user = users[0];

      // Verificar la contraseña con bcrypt
      const passwordMatch = await bcrypt.compare(password, user.contrasena);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      // Crear el token JWT
      const token = jwt.sign(
        { idUsuario: user.idUsuario, rol: user.rol }, // Datos en el token
        secretKey,
        { expiresIn: '2h' } // Expira en 2 horas
      );

      res.json({ token, message: 'Inicio de sesión exitoso' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AuthController;
