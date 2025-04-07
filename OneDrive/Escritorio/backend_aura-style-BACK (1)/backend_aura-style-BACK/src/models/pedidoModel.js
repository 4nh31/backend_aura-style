const db = require('../config/db');

class Pedido {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM pedido');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM pedido WHERE idPedido = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM pedido WHERE idPedido = ?', [id]);
  }

  static async getProductosDePedido(idPedido) {
    const [rows] = await db.query(
      `SELECT pp.idProducto, p.nombre, pp.cantidad
       FROM pedido_producto pp
       JOIN producto p ON pp.idProducto = p.idProducto
       WHERE pp.idPedido = ?`,
      [idPedido]
    );
    return rows;
  }

  static async createPedidoConProductos({ fecha, hora, estado, total, tipo_envio, idUsuario, idCupon, productos }) {
    try {
      await db.beginTransaction();

      const [result] = await db.query(
        'INSERT INTO pedido (fecha, hora, estado, total, tipo_envio, idUsuario, idCupon) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [fecha, hora, estado, total, tipo_envio, idUsuario, idCupon]
      );

      const idPedido = result.insertId;

      for (const { idProducto, cantidad } of productos) {
        await db.query(
          'INSERT INTO pedido_producto (idPedido, idProducto, cantidad) VALUES (?, ?, ?)',
          [idPedido, idProducto, cantidad || 1]
        );
      }

      await db.commit();
      return { idPedido };
    } catch (err) {
      await db.rollback();
      throw err;
    }
  }
}

module.exports = Pedido;
