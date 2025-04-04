const db = require('../config/db'); // Importar la configuración de la base de datos
const jwt = require('jsonwebtoken'); // Importar el módulo jwt para la creación de tokens
const bcrypt = require('bcrypt'); // Importar bcrypt para la verificación de contraseñas cifradas

const secretKey = process.env.JWT_SECRET || 'tu_secreto_super_seguro'; 

class AuthController {
  static async register(req, res) {
    const { nombre, email, password, telefono, direccion } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    }

    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await db.query('INSERT INTO usuario (nombre, correo, contrasena, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?)', 
                     [nombre, email, hashedPassword, telefono, direccion, 'usuario']);

      res.json({ message: 'Registro exitoso' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    try {
      const [users] = await db.query('SELECT * FROM usuario WHERE correo = ?', [email]);

      if (users.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      const user = users[0];

      const passwordMatch = await bcrypt.compare(password, user.contrasena);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      const token = jwt.sign(
        { idUsuario: user.idUsuario, rol: user.rol },
        secretKey,
        { expiresIn: '2h' }
      );

      res.json({ token, idUsuario: user.idUsuario, username: user.nombre, email: user.correo, role: user.rol, message: 'Inicio de sesión exitoso' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AuthController;