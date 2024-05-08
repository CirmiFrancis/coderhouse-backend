import passport from "passport";
import local from "passport-local";

import GitHubStrategy from "passport-github2";

import UserModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    
    // Registro
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            let user = await UserModel.findOne({ email });

            if (user) {
                return done(null, false);
            }

            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role: "user"
            }

            let result = await UserModel.create(newUser);
            return done(null, result);
        } 
        catch (error) {
            return done(error);
        }
    }))

    // Login
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {

        try {
            let user = await UserModel.findOne({ email });

            if (!user) {
                console.log("Este usuario no existe.");
                return done(null, false);
            }

            if (!isValidPassword(password, user)) {
                return done(null, false);
            }

            return done(null, user);
        } 
        catch (error) {
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

    // GitHub: 
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23ctKji9mAe2UJExRS",
        clientSecret: "4fcb4d344269c9c6131d8046cd219f7c1e8e4779",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Profile:", profile);

        try {
            let user = await UserModel.findOne({ email: profile._json.email });

            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 0,
                    email: profile._json.email,
                    password: "",
                    role: "user"
                }
                
                let result = await UserModel.create(newUser);
                done(null, result);
            } 
            else {
                done(null, user);
            }
        } 
        catch (error) {
            return done(error);
        }
    }))
}

export default initializePassport;