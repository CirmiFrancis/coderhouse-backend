import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/user.model.js';

const initializePassport = () => { // estrategia de autenticación basada en JWT
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // especifica cómo extraer el token JWT
        secretOrKey: "coderhouse"
    }, async (jwt_payload, done) => {
        try {
            const user = await UserModel.findById(jwt_payload.user._id); // busca el usuario en la base de datos usando el ID del payload (contiene los datos decodificados del token JWT)
            if (!user) {
                return done(null, false);
            }
            return done(null, user); // devuelve el usuario encontrado
        } catch (error) {
            return done(error);
        }
    }));
}

const cookieExtractor = (req) => { // extrae el token JWT de una cookie específica
    let token = null;
    if(req && req.cookies) {
        token = req.cookies["coderCookieToken"]
    }
    return token;
}

export default initializePassport;