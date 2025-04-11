const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

  // Crear un nuevo usuario y un carrito asociado
  static async create(req, res) {
    const { nombre, email, password, telefono, direccion, rol } = req.body;
  
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
  
    try {
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Iniciar una transacción
      await db.beginTransaction();
  
      // Insertar el nuevo usuario
      const [userResult] = await db.query(
        'INSERT INTO usuario (nombre, correo, contrasena, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, email, hashedPassword, telefono, direccion, rol || 'cliente']
      );
  
      const idUsuario = userResult.insertId;
  
      // Crear un carrito asociado al nuevo usuario
      const [cartResult] = await db.query(
        'INSERT INTO carrito (idUsuario) VALUES (?)',
        [idUsuario]
      );
  
      const idCarrito = cartResult.insertId;
  
      // Confirmar la transacción
      await db.commit();
  
      res.status(201).json({
        message: 'Usuario y carrito creados con éxito',
        idUsuario,
        idCarrito,
      });
    } catch (err) {
      // Revertir la transacción en caso de error
      await db.rollback();
      console.error('Error al crear usuario y carrito:', err);
      res.status(500).json({ error: 'Error al crear usuario y carrito' });
    }
  }

  // Actualizar usuario
  static async update(req, res) {
    const { id } = req.params;
    const { nombre, email, password, telefono, direccion, rol } = req.body;

    try {
      let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

      const updateUserQuery = `
        UPDATE usuario SET 
          nombre = COALESCE(?, nombre), 
          correo = COALESCE(?, correo), 
          contrasena = COALESCE(?, contrasena), 
          telefono = COALESCE(?, telefono), 
          direccion = COALESCE(?, direccion),
          rol = COALESCE(?, rol)
        WHERE idUsuario = ?
      `;

      await db.query(updateUserQuery, [nombre, email, hashedPassword, telefono, direccion, rol, id]);

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

      // Verificar si el usuario ya tiene un carrito asociado
      const [carrito] = await db.query('SELECT idCarrito FROM carrito WHERE idUsuario = ?', [usuario.idUsuario]);
      let idCarrito;

      if (carrito.length === 0) {
        // Si no tiene un carrito, crearlo automáticamente
        const [newCart] = await db.query('INSERT INTO carrito (idUsuario) VALUES (?)', [usuario.idUsuario]);
        idCarrito = newCart.insertId;
      } else {
        idCarrito = carrito[0].idCarrito;
      }

      // Generar el token JWT incluyendo el idCarrito
      const token = jwt.sign(
        { idUsuario: usuario.idUsuario, idCarrito, rol: usuario.rol },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.json({
        message: 'Login exitoso',
        token,
        idUsuario: usuario.idUsuario,
        idCarrito,
        username: usuario.nombre,
        email: usuario.correo,
        role: usuario.rol,
      });
    } catch (err) {
      res.status(500).json({ error: 'Error en el login' });
    }
  }
}

module.exports = User;