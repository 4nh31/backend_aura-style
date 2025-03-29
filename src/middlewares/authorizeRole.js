const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta_segura';

const authorizeRole = (rolesPermitidos) => {
    return (req, res, next) => {
        try {
            const token = req.header('Authorization').split(' ')[1];
            if (!token) return res.status(403).json({ error: 'Acceso denegado' });

            const decoded = jwt.verify(token, SECRET_KEY);
            if (!rolesPermitidos.includes(decoded.rol)) {
                return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
            }

            req.user = decoded; // Guardar los datos del usuario en `req`
            next();
        } catch (err) {
            res.status(401).json({ error: 'Token inválido o expirado' });
        }
    };
};

module.exports = authorizeRole;
