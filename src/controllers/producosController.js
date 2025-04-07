const db = require('../config/db');
const verifyToken = require('../middlewares/authMiddleware');

class Producto {
  // Obtener todos los productos (protegido con JWT)
  static async getALL(req, res) {
    try {
      const [productos] = await db.query('SELECT * FROM producto');
  
      // Obtener imágenes por producto
      const [imagenes] = await db.query('SELECT * FROM imagenproducto');
  
      // Unir imágenes con productos
      const productosConImagenes = productos.map(prod => {
        const imgs = imagenes.filter(img => img.idProducto === prod.idProducto);
        const principal = imgs.find(img => img.es_principal === 1);
        const secundarias = imgs.filter(img => img.es_principal === 0);
  
        return {
          ...prod,
          imagenPrincipal: principal ? principal.url : null,
          imagenSecundariaUno: secundarias[0]?.url || null,
          imagenSecundariaDos: secundarias[1]?.url || null,
        };
      });
  
      res.json(productosConImagenes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  

  // Crear un producto (protegido con JWT)
  static async createProducto(req, res) {
    try {
      const { nombre, descripcion, precio, stock, idCategoria } = req.body;
      const imagenes = req.files;
  
      if (!nombre || !precio || !stock) {
        return res.status(400).json({ error: 'Nombre, precio y stock son obligatorios' });
      }
  
      // 1. Insertar producto
      const [result] = await db.query(
        'INSERT INTO producto (nombre, descripcion, precio, stock, idCategoria) VALUES (?,?,?,?,?)',
        [nombre, descripcion, precio, stock, idCategoria]
      );
  
      const idProducto = result.insertId;
  
      // 2. Insertar imágenes si existen
      if (imagenes && imagenes.length > 0) {
        const insertPromises = imagenes.map((img, index) => {
          const ruta = `/uploads/${img.filename}`;
          const esPrincipal = index === 0 ? 1 : 0; // La primera imagen es la principal
  
          return db.query(
            'INSERT INTO imagenproducto (idProducto, url, es_principal) VALUES (?, ?, ?)',
            [idProducto, ruta, esPrincipal]
          );
        });
  
        await Promise.all(insertPromises);
      }
  
      res.status(201).json({ message: 'Producto creado con imágenes', id: idProducto });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear el producto' });
    }
  }
  // Obtener un producto por ID (protegido con JWT)
  static async getById(req, res) {
    const { id } = req.params;
    try {
      const [[producto]] = await db.query('SELECT * FROM producto WHERE idProducto = ?', [id]);
      if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  
      const [imagenes] = await db.query('SELECT * FROM imagenproducto WHERE idProducto = ?', [id]);
      const principal = imagenes.find(img => img.es_principal === 1);
      const secundarias = imagenes.filter(img => img.es_principal === 0);
  
      res.json({
        ...producto,
        imagenPrincipal: principal ? principal.url : null,
        imagenSecundariaUno: secundarias[0]?.url || null,
        imagenSecundariaDos: secundarias[1]?.url || null,
      });
    } catch (err) {
      res.status(500).json({ error: 'Error al buscar el producto' });
    }
  }
  

  static async updateProducto(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, idCategoria } = req.body;
    const imagenes = req.files;  // Imagenes subidas
  
    if (!nombre || !precio || !stock) {
      return res.status(400).json({ error: 'Nombre, precio y stock son obligatorios' });
    }
  
    try {
      // Actualizar los datos del producto
      const [result] = await db.query(
        'UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, idCategoria = ? WHERE idProducto = ?',
        [nombre, descripcion, precio, stock, idCategoria, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      // Si hay nuevas imágenes, primero borramos las anteriores
      if (imagenes && imagenes.length > 0) {
        // Borrar imágenes anteriores
        await db.query('DELETE FROM imagenproducto WHERE idProducto = ?', [id]);
  
        // Insertar nuevas imágenes
        const insertPromises = imagenes.map((img, index) => {
          const ruta = `/uploads/${img.filename}`;
          const esPrincipal = index === 0 ? 1 : 0;  // La primera imagen es la principal
  
          return db.query(
            'INSERT INTO imagenproducto (idProducto, url, es_principal) VALUES (?, ?, ?)',
            [id, ruta, esPrincipal]
          );
        });
  
        await Promise.all(insertPromises);
      }
  
      res.json({ message: 'Producto actualizado con éxito' });
    } catch (err) {
      console.error(err);  // Para depurar cualquier error en la consola
      res.status(500).json({ error: err.message });
    }
  }
  
  

 
  static async delete(req, res) {
    (req, res, async () => {
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

module.exports = Producto;
