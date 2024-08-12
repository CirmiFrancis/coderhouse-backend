import UserModel from "../models/user.model.js";
import CartModel from "../models/cart.model.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/hashbcryp.js";
import UserDTO from "../dto/user.dto.js";
import { generarResetToken } from "../utils/tokenreset.js";

// Desafio Complementario 3
import EmailManager from "../services/email.js"
const emailManager = new EmailManager();

class UserController { // controlador de usuarios
    async register(req, res) { // registra un nuevo usuario y redirecciona
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existeUsuario = await UserModel.findOne({ email });
            if (existeUsuario) {
                return res.status(400).send("El usuario ya existe.");
            }
            const nuevoCarrito = new CartModel(); // creo un nuevo carrito
            await nuevoCarrito.save();
            const nuevoUsuario = new UserModel({ // creo un nuevo usuario
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
            console.error(error);
            res.status(500).send("Error interno del servidor al registrar un usuario.");
        }
    }

    async login(req, res) { // verifica el ingreso de un usuario y redirecciona
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
                expiresIn: "1h" // el logueo dura 1 hora
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

    async profile(req, res) { // renderizo profile.handlebars y paso datos del usuario
        try {
            const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role); // con DTO
            const isAdmin = req.user.role === 'admin';
            const isPremium = req.user.role === 'premium'; // desafío complementario 3
            res.render("profile", { user: userDto, isAdmin, isPremium }); // desafío complementario 3
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor.');
        }
    }

    async logout(req, res) { // elimina la cookie para desconectar al usuario y redirecciona
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

    async admin(req, res) { // verifica que el rol del usuario sea admin y renderiza admin.handlebars
        if (req.user.role !== "admin") {
            return res.status(403).send("Acceso denegado. Solo los administradores pueden acceder a esta ruta.");
        }
        res.render("admin");
    }

    // Desafio Complementario 3
    async requestPasswordReset(req, res) { // manda un mail al email ingresado y redirecciona
        const { email } = req.body;
        try {
            const user = await UserModel.findOne({ email }); // busco el usuario por email
            if (!user) {
                return res.status(404).send("Usuario no encontrado."); // si no hay usuario, tiro error y el método termina acá
            }
            const token = generarResetToken(); // pero si hay usuario, le genero un token
            user.resetToken = { // una vez que tenemos el token se lo podemos agregar al usuario
                token: token,
                expire: new Date(Date.now() + 3600000) // 1 hora de duración
            }
            await user.save(); // guardamos los cambios
            await emailManager.enviarCorreoRestablecimiento(email, user.first_name, token); // mandamos el mail
            res.redirect("/confirmacion-envio");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor.");
        }
    }

    async resetPassword(req, res) { // obtengo los datos del formulario, verifico que sean correctos y redirecciono
        const { email, password, token } = req.body;
        try {
            const user = await UserModel.findOne({ email }); // busco el usuario por mail...
            if (!user) {
                return res.render("password-restablecer", { error: "Usuario no encontrado." });
            }
            const resetToken = user.resetToken; // saco token y lo verificamos
            if (!resetToken || resetToken.token !== token) {
                return res.render("password-restablecer", { error: "El token es inválido." });
            }
            const ahora = new Date(); // verificamos si el token expiro
            if (ahora > resetToken.expire) {
                return res.render("password-generar", { error: "El token ha expirado." });
            }
            if (isValidPassword(password, user)) { // verificamos que la contraseña nueva no sea igual a la anterior
                return res.render("password-restablecer", { error: "La nueva contraseña no puede ser igual a la anterior." });
            }
            user.password = createHash(password); // actualizo la contraseña
            user.resetToken = undefined; // marcamos como usado el token
            await user.save(); // guardamos los cambios
            return res.redirect("/login");
        } catch (error) {
            console.error(error);
            res.status(500).render("password-generar", { error: "Error interno del servidor." });
        }
    }

    async cambiarRolPremium(req, res) { // cambia el rol de usuario a premium o viceversa
        const { uid } = req.params; 
        try {
            const user = await UserModel.findById(uid); // busco el usuario por ID 
            if(!user) {
                return res.status(404).send("Usuario no encontrado."); 
            }
            const nuevoRol = user.role === "usuario" ? "premium" : "usuario"; // pero si lo encuentro, le cambio el rol 
            const actualizado = await UserModel.findByIdAndUpdate(uid, {role: nuevoRol}); // actualizo el rol
            res.json(actualizado);  
        } catch (error) {
            console.error(error);
            res.status(500).send("Error en el servidor."); 
        }
    }
}

export default UserController;