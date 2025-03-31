const db = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

class Producto {
  // Obtener todos los productos (protegido con JWT)
  static async getALL(req, res) {
    verifyToken(req, res, async () => {
      try {
        const [rows] = await db.query('SELECT * FROM producto');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Crear un producto (protegido con JWT)
  static async createProducto(req, res) {
    verifyToken(req, res, async () => {
      const { nombre, descripcion, precio, stock, idCategoria } = req.body;

      if (!nombre || !precio || !stock) {
        return res.status(400).json({ error: 'Nombre, precio y stock son obligatorios' });
      }

      try {
        const [result] = await db.query(
          'INSERT INTO producto (nombre, descripcion, precio, stock, idCategoria) VALUES (?,?,?,?,?)',
          [nombre, descripcion, precio, stock, idCategoria]
        );
        res.status(201).json({ message: 'Producto agregado con éxito', id: result.insertId });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Obtener un producto por ID (protegido con JWT)
  static async getById(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;
      try {
        const [rows] = await db.query('SELECT * FROM producto WHERE idProducto = ?', [id]);
        if (!rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(rows[0]);
      } catch (err) {
        res.status(500).json({ error: 'Error al buscar el producto' });
      }
    });
  }
  
  static async updateProducto(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, idCategoria } = req.body;
  
    if (!nombre || !precio || !stock) {
      return res.status(400).json({ error: 'Nombre, precio y stock son obligatorios' });
    }
  
    try {
      const [result] = await db.query(
        'UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, idCategoria = ? WHERE idProducto = ?',
        [nombre, descripcion, precio, stock, idCategoria, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      res.json({ message: 'Producto actualizado con éxito' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  

  // Eliminar un producto (protegido con JWT)
  static async delete(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;

      try {
        await db.query('DELETE FROM producto WHERE idProducto = ?', [id]);
        res.json({ message: 'Producto eliminado con éxito' });
      } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
      }
    });
  }
}

module.exports = Producto;