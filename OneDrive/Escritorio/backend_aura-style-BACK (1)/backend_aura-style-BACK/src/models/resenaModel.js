const db = require('../config/db');

class Resena {
  // Obtener todas las reseñas
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM reseña');
    return rows;
  }

  // Crear una nueva reseña
  // Crear un pedido con productos
static async createPedidoConProductos({ fecha, hora, estado, total, tipo_envio, idUsuario, idCupon, productos }) {
  const conn = await db.getConnection(); // Usa transacción para consistencia
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO pedido (fecha, hora, estado, total, tipo_envio, idUsuario, idCupon) VALUES (?,?,?,?,?,?,?)',
      [fecha, hora, estado, total, tipo_envio, idUsuario, idCupon]
    );

    const idPedido = result.insertId;

    for (const producto of productos) {
      const { idProducto, cantidad } = producto;
      await conn.query(
        'INSERT INTO pedido_producto (idPedido, idProducto, cantidad) VALUES (?, ?, ?)',
        [idPedido, idProducto, cantidad || 1]
      );
    }

    await conn.commit();
    return { idPedido };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
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