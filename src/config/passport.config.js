import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from "passport-google-oauth2"; // iniciar con google
import GitHubStrategy from "passport-github2"; // iniciar con github
import UserModel from '../models/user.model.js';
import CartModel from '../models/cart.model.js';

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

    passport.use("google", new GoogleStrategy({ // inicio de sesión con GOOGLE
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://saborear.onrender.com/api/users/google/callback", // modificar en el deploy
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        try {
            let usuario = await UserModel.findOne({ email: profile._json.email });
            if (!usuario) {
                const nuevoCarrito = new CartModel();
                await nuevoCarrito.save();

                const nameParts = profile._json.name.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ' ';

                const nuevoUsuario = new UserModel({
                    first_name: firstName,
                    last_name: lastName,
                    email: profile._json.email,
                    cart: nuevoCarrito._id,
                    password: '',
                    age: 0,
                    role: "usuario"
                });
                await nuevoUsuario.save();

                console.log('Usuario creado:', nuevoUsuario);
                return done(null, nuevoUsuario);
            } else {
                console.log('Usuario existente:', usuario);
                return done(null, usuario);
            }
        } catch (error) {
            console.log('Error en la estrategia de Google:', error);
            return done(error);
        }
    }));

    passport.use("github", new GitHubStrategy({ // inicio de sesión con GITHUB
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "https://saborear.onrender.com/api/users/github/callback", // modificar en el deploy
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let usuario = await UserModel.findOne({ email: profile._json.email });
            if (!usuario) {
                const nuevoCarrito = new CartModel();
                await nuevoCarrito.save();

                const nameParts = profile._json.name.split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

                const nuevoUsuario = new UserModel({
                    first_name: firstName,
                    last_name: lastName,
                    email: profile._json.email,
                    cart: nuevoCarrito._id,
                    password: '',
                    age: 0,
                    role: "usuario"
                });
                await nuevoUsuario.save();

                console.log('Usuario creado:', nuevoUsuario);
                return done(null, nuevoUsuario);
            } else {
                console.log('Usuario existente:', usuario);
                return done(null, usuario);
            }
        } catch (error) {
            console.log('Error en la estrategia de Github:', error);
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
