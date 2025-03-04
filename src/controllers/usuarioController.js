import connection from '../config/db.js';

export const obtenerUsuarios = (req, res) => {
    connection.query('SELECT * FROM Usuario', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        res.json(results);
    });
};
