const db = require('../config/db');

class Resena {
  // Obtener todas las reseñas
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM reseña');
    return rows;
  }

  // Crear una nueva reseña
  static async create({ idUsuario, idProducto, calificacion, comentario, fecha }) {
    const [result] = await db.query(
      'INSERT INTO reseña (idUsuario, idProducto, calificacion, comentario, fecha) VALUES (?, ?, ?, ?, ?)',
      [idUsuario, idProducto, calificacion, comentario, fecha]
    );
    return result;
  }

  // Obtener reseña por ID
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM reseña WHERE idResena = ?', [id]);
    return rows[0];
  }

  // Eliminar una reseña
  static async delete(id) {
    const [result] = await db.query('DELETE FROM reseña WHERE idResena = ?', [id]);
    return result;
  }
}

module.exports = Resena;