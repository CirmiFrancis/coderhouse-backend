import express from "express";
const router = express.Router(); 
import UserModel from "../models/users.model.js";
import { createHash } from "../utils/hashbcrypt.js";

//Ruta Post para generar un usuario y almacenarlo en MongoDB: 

router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body; 

    try {
        //Verificar si el correo ya esta registrado: 
        const existeUsuario = await UserModel.findOne({email:email});
        if ( existeUsuario ) {
            return res.status(400).send("El correo ya esta registrado");
        }

        //Creamos un nuevo usuario: 
        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age
        })

        //Una vez que creo el usuario, puedo crear la sesion: 

        req.session.user = {
            email: newUser.email,
            first_name: newUser.first_name
        };
        req.session.login = true; 

        res.status(200).send("Usuario creado con EXITO!!");

    } catch (error) {
        res.status(500).send("Error al crear el usuario");
    }
})

export default router; 