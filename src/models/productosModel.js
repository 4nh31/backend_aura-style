const db = require('../config/db');

class Producto{
   //obtener todos los productos 

   static async getALL(){
    const [rows] = await db.query('SELECT * FROM Productos');
    return rows;
   }

   static async createProducto(req, res) {
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
  }
}
module.exports = Producto;