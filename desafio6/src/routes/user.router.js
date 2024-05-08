import express from "express";
import passport from "passport";
const router = express.Router(); 

// Genero un usuario y lo almaceno en MongoDB: 
router.post("/", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), async (req, res) => {
    if(!req.user) {
        return res.status(400).send("Credenciales inválidas."); 
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    };

    req.session.login = true;

    res.redirect("/products");
})

router.get("/failedregister", (req, res) => {
    res.send("Registro fallido.");
})

export default router; 