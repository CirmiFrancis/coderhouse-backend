import express from "express";
const router = express.Router(); 
// import UserModel from "../models/users.model.js";
// import { createHash } from "../utils/hashbcrypt.js";
import passport from "passport"; //clase21

// Genero un usuario y lo almaceno en MongoDB: 
// router.post("/", async (req, res) => {
//     const {first_name, last_name, email, password, age} = req.body; 

//     try {
//         const existeUsuario = await UserModel.findOne({email:email});
//         if ( existeUsuario ) {
//             return res.status(400).send("El correo ya esta registrado");
//         }

//         const newUser = await UserModel.create({
//             first_name,
//             last_name,
//             email,
//             password: createHash(password),
//             age
//         })

//         req.session.user = {
//             email: newUser.email,
//             first_name: newUser.first_name,
//             last_name: newUser.last_name,
//             age: newUser.age
//         };
//         req.session.login = true; 

//         res.status(200).send("Usuario creado con éxito.");
//     } 
//     catch (error) {
//         res.status(500).send("Error al crear el usuario.");
//     }
// })

//clase21
//VERSION PARA PASSPORT: 
//(estrategia local)
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
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");
})

router.get("/failedregister", (req, res) => {
    res.send("Registro fallido.");
})

export default router; 