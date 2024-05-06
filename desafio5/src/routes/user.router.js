import express from "express";
const router = express.Router(); 
import UserModel from "../models/users.model.js";
import { createHash } from "../utils/hashbcrypt.js";

//Ruta post para generar un usuario y almacenarlo en MongoDB: 
router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body; 

    try {
        const existeUsuario = await UserModel.findOne({email:email}); // verifico si el correo ya esta registrado
        if ( existeUsuario ) {
            return res.status(400).send("El correo ya esta registrado");
        }

        const newUser = await UserModel.create({ // creamos un nuevo usuario
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            role
        })

        req.session.user = { // una vez que creo el usuario, puedo crear la sesion
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            age: newUser.age,
            role: "user"
        };
        req.session.login = true; 

        res.status(200).send("Usuario creado con éxito.");
    } 
    catch (error) {
        res.status(500).send("Error al crear el usuario.");
    }
})

export default router; 