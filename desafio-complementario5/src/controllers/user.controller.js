import UserModel from "../models/user.model.js";
import CartModel from "../models/cart.model.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/hashbcryp.js";
import UserDTO from "../dto/user.dto.js";
import { generarResetToken } from "../utils/tokenreset.js";

// Desafio Complementario 3
import EmailManager from "../services/email.js"
const emailManager = new EmailManager();

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existeUsuario = await UserModel.findOne({ email });
            if (existeUsuario) {
                return res.status(400).send("El usuario ya existe.");
            }

            //Creo un nuevo carrito: 
            const nuevoCarrito = new CartModel();
            await nuevoCarrito.save();

            const nuevoUsuario = new UserModel({
                first_name,
                last_name,
                email,
                cart: nuevoCarrito._id, 
                password: createHash(password),
                age
            });

            await nuevoUsuario.save();

            const token = jwt.sign({ user: nuevoUsuario }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error); // console.error(error);
            res.status(500).send("Error interno del servidor al registrar un usuario.");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const usuarioEncontrado = await UserModel.findOne({ email });

            if (!usuarioEncontrado) {
                return res.status(401).send("Usuario no válido.");
            }

            const esValido = isValidPassword(password, usuarioEncontrado);
            if (!esValido) {
                return res.status(401).send("Contraseña incorrecta.");
            }

            const token = jwt.sign({ user: usuarioEncontrado }, "coderhouse", {
                expiresIn: "1h" // el logeo dura 1 hora
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            usuarioEncontrado.last_connection = new Date(); // desafio complementario 4
            await usuarioEncontrado.save();

            res.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor al loguear un usuario.");
        }
    }

    async profile(req, res) {
        try {
            //Con DTO: 
            const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
            const isAdmin = req.user.role === 'admin';
            const isPremium = req.user.role === 'premium'; // desafío complementario 3
            res.render("profile", { user: userDto, isAdmin, isPremium }); // desafío complementario 3
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor.');
        }
    }

    async logout(req, res) {
        try {
            const { email } = req.user; // desafio complementario 4
            const usuarioEncontrado = await UserModel.findOne({ email });
            usuarioEncontrado.last_connection = new Date();
            await usuarioEncontrado.save();
    
            res.clearCookie("coderCookieToken");
            res.redirect("/login");
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor.');
        }
    }

    async admin(req, res) {
        if (req.user.role !== "admin") {
            return res.status(403).send("Acceso denegado. Solo los administradores pueden acceder a esta ruta.");
        }
        res.render("admin");
    }

    // Desafio Complementario 3
    async requestPasswordReset(req, res) {
        const { email } = req.body;
        try {
            const user = await UserModel.findOne({ email }); // Busco el usuario por email
            if (!user) {
                return res.status(404).send("Usuario no encontrado."); // Si no hay usuario, tiro error y el método termina acá
            }

            const token = generarResetToken(); // Pero si hay usuario, le genero un token

            user.resetToken = { // Una vez que tenemos el token se lo podemos agregar al usuario
                token: token,
                expire: new Date(Date.now() + 3600000) // 1 Hora de duración
            }

            await user.save(); // Guardamos los cambios
            await emailManager.enviarCorreoRestablecimiento(email, user.first_name, token); // Mandamos el mail

            res.redirect("/confirmacion-envio");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor.");
        }
    }

    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            const user = await UserModel.findOne({ email }); // Busco el usuario por mail...
            if (!user) {
                return res.render("password-restablecer", { error: "Usuario no encontrado." });
            }

            const resetToken = user.resetToken; // Saco token y lo verificamos
            if (!resetToken || resetToken.token !== token) {
                return res.render("password-restablecer", { error: "El token es inválido." });
            }

            const ahora = new Date(); // Verificamos si el token expiro
            if (ahora > resetToken.expire) {
                return res.render("password-generar", { error: "El token ha expirado." });
            }

            if (isValidPassword(password, user)) { // Verificamos que la contraseña nueva no sea igual a la anterior
                return res.render("password-restablecer", { error: "La nueva contraseña no puede ser igual a la anterior." });
            }

            user.password = createHash(password); // Actualizo la contraseña

            user.resetToken = undefined; // Marcamos como usado el token
            await user.save(); // Guardamos los cambios

            return res.redirect("/login");

        } catch (error) {
            console.error(error);
            res.status(500).render("password-generar", { error: "Error interno del servidor." });
        }
    }

    async cambiarRolPremium(req, res) {
        const {uid} = req.params; 

        try {
            const user = await UserModel.findById(uid); // Busco el usuario por ID 
            if(!user) {
                return res.status(404).send("Usuario no encontrado."); 
            }

            const nuevoRol = user.role === "usuario" ? "premium" : "usuario"; // Pero si lo encuentro, le cambio el rol 
            const actualizado = await UserModel.findByIdAndUpdate(uid, {role: nuevoRol}); // Actualizo el rol
            res.json(actualizado);  
        } catch (error) {
            console.error(error);
            res.status(500).send("Error en el servidor."); 
        }
    }
}

export default UserController;