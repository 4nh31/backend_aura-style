const db = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

class Categoria {
  // Obtener todas las categorías (protegido con JWT)
  static async getAll(req, res) {
      try {
        const [rows] = await db.query('SELECT * FROM categoria');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
  }

  // Actualizar una categoría (protegido con JWT)
static async update(req, res) {
  verifyToken(req, res, async () => {
    const { id } = req.params;
    const { nombre, descripcion, parent_id } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({ error: 'Datos faltantes' });
    }

    try {
      const [result] = await db.query(
        'UPDATE categoria SET nombre = ?, descripcion = ?, parent_id = ? WHERE idCategoria = ?',
        [nombre, descripcion, parent_id, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      res.json({ message: 'Categoría actualizada con éxito' });
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
  });
}


  // Crear una categoría (protegido con JWT)
  static async createCategoria(req, res) {
    verifyToken(req, res, async () => {
      const { nombre, descripcion, parent_id } = req.body;

      if (!nombre) {
        return res.status(400).json({ error: 'El nombre es obligatorio' });
      }

      try {
        const [result] = await db.query(
          'INSERT INTO categoria (nombre, descripcion, parent_id) VALUES (?,?,?)',
          [nombre, descripcion, parent_id]
        );
        res.status(201).json({ message: 'Categoría creada con éxito', id: result.insertId });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Obtener una categoría por ID (protegido con JWT)
  static async getById(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;
      try {
        const [rows] = await db.query('SELECT * FROM categoria WHERE idCategoria = ?', [id]);
        if (!rows.length) return res.status(404).json({ error: 'Categoría no encontrada' });
        res.json(rows[0]);
      } catch (err) {
        res.status(500).json({ error: 'Error al buscar la categoría' });
      }
    });
  }

  // Eliminar una categoría (protegido con JWT)
  static async delete(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;

      try {
        await db.query('DELETE FROM categoria WHERE idCategoria = ?', [id]);
        res.json({ message: 'Categoría eliminada con éxito' });
      } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la categoría' });
      }
    });
  }
}

module.exports = Categoria;