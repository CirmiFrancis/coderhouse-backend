//Instalamos: npm i passport passport-local

//Importamos los módulos: 
import passport from "passport";
import local from "passport-local";

//Estrategia con GitHub:
import GitHubStrategy from "passport-github2";

//Traemos el UsuarioModel y las funciones de bcryp: 
import UserModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    //Vamos a armar nuestras estrategias: Registro y Login. 
    passport.use("register", new LocalStrategy({
        //Le digo que quiero acceder al objeto request
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            //Verificamos si ya existe un registro con ese email: 
            let user = await UserModel.findOne({ email });

            if (user) {
                return done(null, false);
            }

            //Si no existe voy a crear un registro de usuario nuevo: 
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);
            return done(null, result);
            //Si todo resulta bien, podemos mandar done con el usuario generado. 
        } catch (error) {
            return done(error);
        }
    }))

    //Agregamos otra estrategia para el "Login".
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {

        try {
            //Primero verifico si existe un usuario con ese email: 
            let user = await UserModel.findOne({ email });

            if (!user) {
                console.log("Este usuario no existe.");
                return done(null, false);
            }

            //Si existe verifico la contraseña: 
            if (!isValidPassword(password, user)) {
                return done(null, false);
            }

            return done(null, user);


        } catch (error) {
            return done(error);
        }
    }))

    //Serializar y deserializar: 
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    })

    //Acá generamos la nueva estrategia con GitHub: 
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23ctKji9mAe2UJExRS",
        clientSecret: "4fcb4d344269c9c6131d8046cd219f7c1e8e4779",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        //Veo los datos del perfil
        console.log("Profile:", profile);

        try {
            let user = await UserModel.findOne({ email: profile._json.email });

            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: "",
                    email: profile._json.email,
                    password: ""
                }

                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))
}

export default initializePassport;