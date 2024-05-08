import express from "express";
import passport from "passport";
const router = express.Router(); 

router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    
    res.redirect("/");
})

// LOCAL: 
router.post("/login", (req, res, next) => {
    const { email, password } = req.body;

    // Loguearse como admin
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        req.session.user = {
            email: email,
            first_name: "-",
            last_name: "-",
            age: "-",
            role: "admin"
        };
        req.session.login = true;
        return res.redirect("/products");
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
                role: "user"
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

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/"
}), async (req, res) => {
    req.session.user = req.user; 
    req.session.login = true; 
    res.redirect("/products");
})

export default router; 