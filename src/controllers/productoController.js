import connection from '../config/db.js';

// Obtener todos los productos
export const obtenerProductos = (req, res) => {
    connection.query('SELECT * FROM Producto', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Agregar un nuevo producto
export const agregarProducto = (req, res) => {
    console.log("Body recibido:", req.body);

    const { nombre, descripcion, precio, stock, idCategoria } = req.body;
    if (!nombre || !precio || !stock) {
        return res.status(400).json({ error: 'Nombre, precio y stock son obligatorios' });
    }

    const query = 'INSERT INTO Producto (nombre, descripcion, precio, stock, idCategoria) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [nombre, descripcion, precio, stock, idCategoria], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Producto agregado con éxito', id: result.insertId });
    });
};
