import passport from "passport";
import local from "passport-local";

// import CartManager from "../controllers/carts.controller.js";
// const cartManager = new CartManager();

import CartService from "../services/carts.service.js";
const cartService = new CartService();

import GitHubStrategy from "passport-github2"; // iniciar con github
import { Strategy as GoogleStrategy } from "passport-google-oauth2"; // iniciar con google

import UserModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";

import configObject from "./config.js";
const { github_clientId, github_clientSecret, google_clientId, google_clientSecret } = configObject;

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

            let newUser = { // Genero y asigno un carrito al nuevo usuario
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: await cartService.createCart(), // ¿Cambiar por cartManager?
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

    // GITHUB: 
    passport.use("github", new GitHubStrategy({
        clientID: github_clientId,
        clientSecret: github_clientSecret,
        callbackURL: "http://localhost:8080/api/sessions/github/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Profile:", profile);

        try {
            let user = await UserModel.findOne({ email: profile._json.email });

            if (!user) {
                // Genero y asigno un carrito al nuevo usuario con github
                const newCart = await cartService.createCart(); // ¿Cambiar por cartManager?

                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    age: 0,
                    password: "",
                    cart: newCart,
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

    // GOOGLE: 
    passport.use("google", new GoogleStrategy({
        clientID: google_clientId,
        clientSecret: google_clientSecret,
        callbackURL: "http://localhost:8080/api/sessions/google/callback",
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
        console.log("Profile:", profile);

        try {
            let user = await UserModel.findOne({ email: profile._json.email });

            if (!user) {
                // Genero y asigno un carrito al nuevo usuario con github
                const newCart = await cartService.createCart(); // ¿Cambiar por cartManager?
                
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    age: 0,
                    password: "",
                    cart: newCart,
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