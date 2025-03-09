const db = require('../config/db');
const bcrypt = require('bcrypt');
const verifyToken = require('../middlewares/authMiddleware'); // Importamos el middleware

class User {
  // Obtener todos los usuarios (protegido con JWT)
  static async getAll(req, res) {
    verifyToken(req, res, async () => {
      try {
        const [rows] = await db.query('SELECT * FROM usuario');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Buscar usuario por ID (protegido con JWT)
  static async getById(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;
      try {
        const [rows] = await db.query('SELECT * FROM usuario WHERE idUsuario = ?', [id]);
        if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(rows[0]);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Crear un nuevo usuario (protegido con JWT)
  static async create(req, res) {
    verifyToken(req, res, async () => {
      const { nombre, email, password, telefono, direccion, rol } = req.body;

      try {
        // Generar un hash para la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertar en la base de datos con la contraseña encriptada
        const [result] = await db.query(
          'INSERT INTO usuario (nombre, correo, contrasena, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?)',
          [nombre, email, hashedPassword, telefono, direccion, rol]
        );

        res.status(201).json({ message: 'Usuario creado con éxito', id: result.insertId });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Actualizar usuario (protegido con JWT)
  static async update(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;
      const { nombre, email, password, telefono, direccion, rol } = req.body;

      try {
        let hashedPassword = password;

        if (password) {
          const saltRounds = 10;
          hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        await db.query(
          'UPDATE usuario SET nombre = ?, correo = ?, contrasena = ?, telefono = ?, direccion = ?, rol = ? WHERE idUsuario = ?',
          [nombre, email, hashedPassword, telefono, direccion, rol, id]
        );

        res.json({ message: 'Usuario actualizado con éxito' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Eliminar usuario (protegido con JWT)
  static async delete(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;

      try {
        await db.query('DELETE FROM usuario WHERE idUsuario = ?', [id]);
        res.json({ message: 'Usuario eliminado con éxito' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }
}

module.exports = User;
