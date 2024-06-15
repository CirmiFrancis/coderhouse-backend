import passport from "passport";

import configObject from "../config/config.js";
const { admin_email, admin_pass } = configObject;

// import CartController from "../controllers/carts.controller.js";
// const cartController = new CartController();

import CartService from "../services/carts.service.js";
const cartService = new CartService();

import respon from "../utils/reusables.js";

class SessionController { // consultado por el router

    async logout(req, res) {
        if (req.session.login) {
            req.session.destroy();
        }
        res.redirect("/");
    }

    // LOCAL: 
    async login(req, res, next) {
        const { email, password } = req.body;

        // Loguearse como admin
        if (email === admin_email && password === admin_pass) {
            try {
                req.session.user = {
                    email: email,
                    first_name: "-",
                    last_name: "-",
                    age: "-",
                    cart: await cartService.getCartById('6632a37555a7955a2fb27129'), // cart asignado al admin (hardcodeado). ¿Cambiar por cartController?
                    role: "admin"
                };
                req.session.login = true;
                return res.redirect("/products");
            } 
            catch (error) {
                respon(res, 500, "Error al intentar loguear como admin.");
            }
        }

        // Si no es un admin, usar Passport.js para autenticación
        passport.authenticate("login", (error, user) => {
            if (error) { 
                return next(error); 
            }

            if (!user) { 
                respon(res, 400, "Credenciales inválidas.");
            }

            req.logIn(user, (error) => {
                if (error) { 
                    return next(error); 
                }
                
                req.session.user = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    age: user.age,
                    email: user.email,
                    cart: user.cart, // cart asignado al user al loguearse
                    role: user.role
                };
                req.session.login = true;
                return res.redirect("/products");
            });
        })(req, res, next);
    }

    async failLogin(req, res) {
        res.send("Falló el login.");
    }

    // GITHUB: 
    async githubCallback(req, res) {
        req.session.user = req.user; 
        req.session.login = true; 
        res.redirect("/products");
    }

    // GOOGLE: 
    async googleCallback(req, res) {
        req.session.user = req.user; 
        req.session.login = true; 
        res.redirect("/products");
    }
    
}

export default SessionController;