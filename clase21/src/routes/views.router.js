import express from "express";
const router = express.Router(); 

router.get("/", (req, res) => {
    res.render("nav");
})

router.get("/login", (req, res) => {
    if(req.session.login) {
        return res.redirect("/profile");
    }
    
    res.render("login");
})

router.get("/register", (req, res) => {
    if(req.session.login) {
        return res.redirect("/profile");
    }

    res.render("register");
})

//Mi perfil: 
router.get("/profile", (req, res) => {
    if (!req.session.login) {
        return res.redirect("/login");
    }

    res.render("profile", {
        last_name: req.session.user.last_name, 
        first_name: req.session.user.first_name, 
        age: req.session.user.age
    });
})

export default router; 