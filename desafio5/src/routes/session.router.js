import express from "express";
const router = express.Router(); 
import UserModel from "../models/users.model.js";
import { isValidPassword } from "../utils/hashbcrypt.js";

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") { // loguearse como admin
            req.session.login = true; 
            req.session.user = {
                email: email, 
                first_name: "-",
                last_name: "-",
                age: "-",
                role: "admin"
            }
            res.redirect("/products");
        }
        else { // loguearse como user
            const user = await UserModel.findOne({email:email});
            if( user ) {
                //Ahora con BCRYPT: 
                if(isValidPassword(password, user)) {    
                    req.session.login = true; 
                    req.session.user = {
                        email: user.email, 
                        first_name: user.first_name,
                        last_name: user.last_name,
                        age: user.age,
                        role: "user"
                    }
                    res.redirect("/products");
                } 
                else {
                    res.status(401).send("Contraseña no valida");
                }
            } 
            else {
                res.status(404).send("Usuario no encontrado");
            }  
        }
    } 
    catch (error) {
        res.status(400).send("Error en el Login");
    }
})

router.get("/logout", (req, res) => { // desloguearse y volver a la pantalla login
    if(req.session.login) {
        req.session.destroy();
    }
    
    res.redirect("/");
})

export default router; 