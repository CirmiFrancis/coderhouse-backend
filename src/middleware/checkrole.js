import jwt from 'jsonwebtoken';

const checkUserRole = (allowedRoles) => (req, res, next) => { // middleware usada en views.router.js para determinar si el usuario tiene el rol requerido
    const token = req.cookies.coderCookieToken;

    if (token) {
        jwt.verify(token, 'coderhouse', (err, decoded) => {
            if (err) {
                res.status(403).send('Acceso denegado. Token inválido.');
            } else {
                const userRole = decoded.user.role;
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    res.status(403).send('Acceso denegado. No tienes permiso para acceder a esta página.');
                }
            }
        });
    } else {
        res.status(403).send('Acceso denegado. Token no proporcionado.');
    }
};

export default checkUserRole;