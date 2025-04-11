const db = require('../config/db'); // Conexión a la base de datos

// Obtener productos del carrito de un usuario, incluyendo idCarrito y total
exports.getCartDetails = async (userId) => {
  const query = `
    SELECT
      c.idCarrito,
      cp.idProducto,
      p.nombre,
      p.precio,
      cp.cantidad,
      (p.precio * cp.cantidad) AS subtotal,
      ip.url AS imagen
    FROM carrito c
    LEFT JOIN carritoproducto cp ON c.idCarrito = cp.idCarrito
    LEFT JOIN producto p ON cp.idProducto = p.idProducto
    LEFT JOIN imagenproducto ip ON p.idProducto = ip.idProducto AND ip.es_principal = 1
    WHERE c.idUsuario = ?;
  `;

  const [rows] = await db.query(query, [userId]);

  if (rows.length === 0) {
    const [carrito] = await db.query('SELECT idCarrito FROM carrito WHERE idUsuario = ?', [userId]);
    return {
      idCarrito: carrito[0]?.idCarrito || null,
      productos: [],
      total: 0,
    };
  }

  const idCarrito = rows[0].idCarrito;
  const productos = rows.map(row => ({
    idProducto: row.idProducto,
    nombre: row.nombre,
    precio: row.precio,
    cantidad: row.cantidad,
    subtotal: row.subtotal,
    imagen: row.imagen,
  }));
  const total = productos.reduce((acc, producto) => acc + producto.subtotal, 0);

  return {
    idCarrito,
    productos,
    total,
  };
};