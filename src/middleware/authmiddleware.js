import passport from 'passport';

function authMiddleware(req, res, next) { // middleware que autentica al usuario
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.user = null;
        } else {
            req.user = user;
        }
        next();
    })(req, res, next);
}

export default authMiddleware;