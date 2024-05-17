import express from "express";
import passport from "passport";
const router = express.Router();

import CartManager from "../controllers/CartManager.js";
const cartManager = new CartManager();

router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    
    res.redirect("/");
})

// LOCAL: 
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    // Loguearse como admin
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        try {
            req.session.user = {
                email: email,
                first_name: "-",
                last_name: "-",
                age: "-",
                cart: await cartManager.getCartById('6632a37555a7955a2fb27129'), // cart asignado al admin (hardcodeado)
                role: "admin"
            };
            req.session.login = true;
            return res.redirect("/products");
        } 
        catch (error) {
            console.error("Error al intentar loguear como admin.", error);
            res.status(500).json({
                error: "Error interno del servidor."
            });
        }
    }

    // Si no es un admin, usar Passport.js para autenticación
    passport.authenticate("login", (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { 
            return res.status(400).send("Credenciales inválidas."); 
        }

        req.logIn(user, (err) => {
            if (err) { return next(err); }
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
});

router.get("/faillogin", async (req, res) => {
    res.send("Falló el login.");
})

// GITHUB: 
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/github/callback", passport.authenticate("github", {
    failureRedirect: "/"
}), async (req, res) => {
    req.session.user = req.user; 
    req.session.login = true; 
    res.redirect("/products");
})

// GOOGLE: 
router.get('/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }), async (req, res) => { })

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), async (req, res) => {
    req.session.user = req.user; 
    req.session.login = true; 
    res.redirect("/products");
});

export default router; 