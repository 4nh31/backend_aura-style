const db = require('../config/db');

class Categoria {
  // Obtener todas las categorías
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM categoria');
    return rows;
  }

  // Crear una categoría
  static async createCategoria({ nombre, descripcion, parent_id }) {
    const [result] = await db.query(
      'INSERT INTO categoria (nombre, descripcion, parent_id) VALUES (?,?,?)',
      [nombre, descripcion, parent_id]
    );
    return result;
  }

  // Obtener una categoría por ID
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM categoria WHERE idCategoria = ?', [id]);
    return rows[0];
  }

  // Eliminar una categoría
  static async delete(id) {
    await db.query('DELETE FROM categoria WHERE idCategoria = ?', [id]);
  }
}

module.exports = Categoria;