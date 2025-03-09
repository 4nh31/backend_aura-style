const db = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

class Producto {
  // Obtener todos los productos (protegido con JWT)
  static async getALL(req, res) {
    verifyToken(req, res, async () => {
      try {
        const [rows] = await db.query('SELECT * FROM Productos');
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
          'INSERT INTO Productos (nombre, descripcion, precio, stock, idCategoria) VALUES (?,?,?,?,?)',
          [nombre, descripcion, precio, stock, idCategoria]
        );
        res.status(201).json({ message: 'Producto agregado con éxito', id: result.insertId });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }
}

module.exports = Producto;
