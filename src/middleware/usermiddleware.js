function userMiddleware(req, res, next) { // middleware que asegura que, para cada solicitud, la información del usuario autenticado (presente en req.user) esté disponible en res.locals.user. Esto permite que las vistas accedan fácilmente a la información del usuario sin tener que pasarla explícitamente en cada renderizado
    res.locals.user = req.user;
    next();
}

export default userMiddleware;