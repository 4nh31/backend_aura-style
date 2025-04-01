const db = require('../config/db');
const bcrypt = require('bcrypt')

class User {
  //buscar todos los usuarios
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM usuario');
    return rows;
  }
  //Buscar usuario por id 
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM usuario WHERE idUsuario = ?', [id]);
    return rows[0];
  }


  //crear un nuevo usuario
  static async create(user) {
    const { nombre, email, password, telefono, direccion, rol } = user;

    // Generar un hash para la contraseña
    const saltRounds = 10; // Número de rondas de encriptación
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar en la base de datos con la contraseña encriptada
    const [result] = await db.query(
        'INSERT INTO usuario (nombre, correo, contrasena, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, email, hashedPassword, telefono, direccion, rol]
    );

    return result.insertId;
  }

  static async update(id, user) {
    const { nombre, email, password, telefono, direccion, rol } = user;

    let hashedPassword = password;

    // Verificar si se proporcionó una nueva contraseña
    if (password) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    await db.query(
        'UPDATE usuario SET nombre = ?, correo = ?, contrasena = ?, telefono = ?, direccion = ?, rol = ? WHERE id = ?',
        [nombre, email, hashedPassword, telefono, direccion, rol, id]
    );

    return true;
}

  static async delete(id) {
    await db.query('DELETE FROM usuario WHERE idUsuario = ?', [id]);
    return true;
  }
}

module.exports = User;
