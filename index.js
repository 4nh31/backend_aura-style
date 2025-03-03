const express = require('express');
const connection = require('./src/config/db.js'); 

const app = express();
const PORT = 3000;

// Middleware para procesar JSON en las solicitudes
app.use(express.json());

// 1. Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    connection.query('SELECT * FROM usuario', (err, results) => {
        if (err) {
            return res.status(500).send('Error en la base de datos');
        }
        res.json(results);
    });
});

// 2. Obtener todos los productos
app.get('/productos', (req, res) => {
    connection.query('SELECT * FROM Producto', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 3. Agregar un nuevo producto
app.post('/productos', (req, res) => {
    console.log("Body recibido:", req.body); // Para depuración

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
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


//LISTO