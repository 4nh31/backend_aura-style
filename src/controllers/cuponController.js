const db = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

class CuponController {
  // Obtener todos los cupones (protegido con JWT)
  static async getAll(req, res) {
    
      try {
        const [rows] = await db.query('SELECT * FROM cupon');
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
  
  }

  // Crear un cupón (protegido con JWT)
  static async create(req, res) {
    verifyToken(req, res, async () => {
      const { codigo, expirationDate, discountValue } = req.body;

      if (!codigo || !expirationDate) {
        return res.status(400).json({ error: 'Código y fecha de expiración son obligatorios' });
      }

      try {
        const [result] = await db.query(
          'INSERT INTO cupon (codigo, fecha_expiracion, valor_descuento) VALUES (?, ?, ?)',
          [codigo, expirationDate, discountValue]
        );
        res.status(201).json({ message: 'Cupón creado con éxito', id: result.insertId });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Obtener cupón por ID (protegido con JWT)
  static async getById(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;
      try {
        const [rows] = await db.query('SELECT * FROM cupon WHERE idCupon = ?', [id]);
        if (!rows.length) return res.status(404).json({ error: 'Cupón no encontrado' });
        res.json(rows[0]);
      } catch (err) {
        res.status(500).json({ error: 'Error al buscar el cupón' });
      }
    });
  }

  // Eliminar un cupón (protegido con JWT)
  static async delete(req, res) {
    verifyToken(req, res, async () => {
      const { id } = req.params;
      try {
        await db.query('DELETE FROM cupon WHERE idCupon = ?', [id]);
        res.json({ message: 'Cupón eliminado con éxito' });
      } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el cupón' });
      }
    });
  }

  // Validar un cupón (público o protegido según necesidad)
  static async validar(req, res) {
    const { codigo } = req.params;
    try {
      const cupon = await db.query(
        'SELECT * FROM cupon WHERE codigo = ? AND fecha_expiracion >= CURDATE()',
        [codigo]
      );
      if (!cupon[0].length) return res.status(404).json({ error: 'Cupón no válido o expirado' });
      res.json(cupon[0][0]);
    } catch (err) {
      res.status(500).json({ error: 'Error al validar el cupón' });
    }
  }

  // Actualizar un cupón (protegido con JWT)
static async update(req, res) {
  verifyToken(req, res, async () => {
    const { id } = req.params;
    const { codigo, expirationDate, discountValue } = req.body;

    if (!codigo || !expirationDate) {
      return res.status(400).json({ error: 'Código y fecha de expiración son obligatorios' });
    }

    try {
      const [result] = await db.query(
        'UPDATE cupon SET codigo = ?, fecha_expiracion = ?, valor_descuento = ? WHERE idCupon = ?',
        [codigo, expirationDate, discountValue, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Cupón no encontrado' });
      }

      res.json({ message: 'Cupón actualizado con éxito' });
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar el cupón' });
    }
  });
}


}

module.exports = CuponController;