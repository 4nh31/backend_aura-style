const db = require('../config/db');

// Obtener los productos del carrito de un usuario
exports.getCart = async (req, res) => {
  try {
    const { idCarrito } = req.user; // Extraer el idCarrito desde el token
    console.log("Controlador - Obtener Carrito: idCarrito:", idCarrito);

    const query = `
      SELECT
        cp.idProducto,
        p.nombre,
        p.precio,
        cp.cantidad,
        (p.precio * cp.cantidad) AS subtotal,
        ip.url AS imagen
      FROM carritoproducto cp
      INNER JOIN producto p ON cp.idProducto = p.idProducto
      LEFT JOIN imagenproducto ip ON p.idProducto = ip.idProducto AND ip.es_principal = 1
      WHERE cp.idCarrito = ?;
    `;
    const [rows] = await db.query(query, [idCarrito]);

    console.log("Controlador - Productos en el carrito:", rows);

    const total = rows.reduce((sum, item) => sum + item.subtotal, 0);

    res.status(200).json({ success: true, data: { productos: rows, total } });
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ success: false, message: 'Error al obtener el carrito' });
  }
};

// Añadir un producto al carrito
exports.addProduct = async (req, res) => {
  try {
    const { idCarrito } = req.user;
    const { productId, quantity } = req.body;

    console.log("Controlador - Añadir Producto: idCarrito:", idCarrito, "productId:", productId, "quantity:", quantity);

    // Verificar si el producto ya está en el carrito
    const [existingProduct] = await db.query(
      'SELECT cantidad FROM carritoproducto WHERE idCarrito = ? AND idProducto = ?',
      [idCarrito, productId]
    );

    console.log("Controlador - Producto existente en el carrito:", existingProduct);

    if (existingProduct.length > 0) {
      // Actualizar la cantidad del producto
      const updateResult = await db.query(
        'UPDATE carritoproducto SET cantidad = cantidad + ? WHERE idCarrito = ? AND idProducto = ?',
        [quantity, idCarrito, productId]
      );
      console.log("Controlador - Cantidad actualizada:", updateResult);
    } else {
      // Añadir el producto al carrito con precio_unitario
      const insertResult = await db.query(
        `INSERT INTO carritoproducto (idCarrito, idProducto, cantidad, precio_unitario)
         VALUES (?, ?, ?, (SELECT precio FROM producto WHERE idProducto = ?))`,
        [idCarrito, productId, quantity, productId]
      );
      console.log("Controlador - Producto añadido al carrito:", insertResult);
    }

    res.status(200).json({ success: true, message: 'Producto añadido al carrito' });
  } catch (error) {
    console.error('Error al añadir producto al carrito:', error);
    res.status(500).json({ success: false, message: 'Error al añadir producto al carrito' });
  }
};

// Actualizar la cantidad de un producto en el carrito
exports.updateProductQuantity = async (req, res) => {
  try {
    const { idCarrito } = req.user;
    const { productId } = req.params;
    const { quantity } = req.body;

    console.log("Controlador - Actualizar Cantidad: idCarrito:", idCarrito, "productId:", productId, "quantity:", quantity);

    // Validar que la cantidad sea positiva
    if (quantity <= 0) {
      console.log("Controlador - Error: Cantidad debe ser mayor a 0.");
      return res.status(400).json({ success: false, message: 'La cantidad debe ser mayor a 0' });
    }

    const updateResult = await db.query(
      'UPDATE carritoproducto SET cantidad = ? WHERE idCarrito = ? AND idProducto = ?',
      [quantity, idCarrito, productId]
    );

    console.log("Controlador - Cantidad actualizada:", updateResult);

    res.status(200).json({ success: true, message: 'Cantidad actualizada' });
  } catch (error) {
    console.error('Error al actualizar la cantidad de producto:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar la cantidad del producto' });
  }
};

// Eliminar un producto del carrito
exports.removeProduct = async (req, res) => {
  try {
    const { idCarrito } = req.user;
    const { productId } = req.params;

    console.log("Controlador - Eliminar Producto: idCarrito:", idCarrito, "productId:", productId);

    const deleteResult = await db.query(
      'DELETE FROM carritoproducto WHERE idCarrito = ? AND idProducto = ?',
      [idCarrito, productId]
    );

    console.log("Controlador - Producto eliminado del carrito:", deleteResult);

    res.status(200).json({ success: true, message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el producto del carrito' });
  }
};

// Vaciar el carrito
exports.clearCart = async (req, res) => {
  try {
    const { idCarrito } = req.user; // Obtener el idCarrito desde el token del usuario

    console.log("Controlador - Vaciar Carrito: idCarrito:", idCarrito);

    // Eliminar todos los productos del carrito
    const deleteResult = await db.query('DELETE FROM carritoproducto WHERE idCarrito = ?', [idCarrito]);

    console.log("Controlador - Carrito vaciado:", deleteResult);

    res.status(200).json({ success: true, message: 'Carrito vaciado correctamente' });
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    res.status(500).json({ success: false, message: 'Error al vaciar el carrito' });
  }
};