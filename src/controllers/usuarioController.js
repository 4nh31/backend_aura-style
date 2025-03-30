const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // JWT para autenticación
const verifyToken = require('../middlewares/authMiddleware');

const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta_segura';

class User {
  // Obtener todos los usuarios (protegido con JWT)
  static async getAll(req, res) {
    try {
      const [rows] = await db.query('SELECT * FROM usuario');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  }

  // Buscar usuario por ID (protegido con JWT)
  static async getById(req, res) {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM usuario WHERE idUsuario = ?', [id]);
      if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Error al buscar el usuario' });
    }
  }

  // Crear un nuevo usuario
  static async create(req, res) {
    const { nombre, email, password, telefono, direccion, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.query(
        'INSERT INTO usuario (nombre, correo, contrasena, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, email, hashedPassword, telefono, direccion, rol]
      );

      res.status(201).json({ message: 'Usuario creado con éxito', id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  }

  // Actualizar usuario
  static async update(req, res) {
    const { id } = req.params;
    const { nombre, email, password, telefono, direccion, rol } = req.body;

    try {
      let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

      await db.query(
        'UPDATE usuario SET nombre = ?, correo = ?, contrasena = ?, telefono = ?, direccion = ?, rol = ? WHERE idUsuario = ?',
        [nombre, email, hashedPassword, telefono, direccion, rol, id]
      );

      res.json({ message: 'Usuario actualizado con éxito' });
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  }

  // Eliminar usuario
  static async delete(req, res) {
    const { id } = req.params;

    try {
      await db.query('DELETE FROM usuario WHERE idUsuario = ?', [id]);
      res.json({ message: 'Usuario eliminado con éxito' });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  }

  // Login (Generar token JWT)
  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const [rows] = await db.query('SELECT * FROM usuario WHERE correo = ?', [email]);
      if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });

      const usuario = rows[0];
      const isMatch = await bcrypt.compare(password, usuario.contrasena);

      if (!isMatch) return res.status(401).json({ error: 'Credenciales incorrectas' });

      const token = jwt.sign({ idUsuario: usuario.idUsuario, rol: usuario.rol }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ message: 'Login exitoso', token });
    } catch (err) {
      res.status(500).json({ error: 'Error en el login' });
    }
  }
}

module.exports = User;
