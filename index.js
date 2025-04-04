const http = require('http');
const express = require('express');
const connection = require('./src/config/db.js'); 

const app = express();
const PORT = 3000;

// Ruta de ejemplo
app.get('/usuarios', (req, res) => {
    connection.query('SELECT * FROM usuario', (err, results) => {
      if (err) {
        return res.status(500).send('Error en la base de datos');
      }
      res.json(results);
    });
  });

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});