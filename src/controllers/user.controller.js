import UserModel from "../models/user.model.js";
import CartModel from "../models/cart.model.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils/hashbcryp.js";
import { generarResetToken } from "../utils/tokenreset.js";

import EmailManager from "../services/email.js"
const emailManager = new EmailManager();

import UserRepository from "../repositories/user.repository.js";
const userRepository = new UserRepository();

class UserController { // controlador de usuarios
    async register(req, res) { // registra un nuevo usuario y redirecciona
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existeUsuario = await UserModel.findOne({ email });
            if (existeUsuario) {
                return res.status(400).render("register", {error: "El usuario ya existe."});
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
            res.redirect("/profile");
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
                return res.status(401).render("login", {error: "Usuario no válido."});
            }
            const esValido = isValidPassword(password, usuarioEncontrado);
            if (!esValido) {
                return res.status(401).render("login", {error: "Contraseña incorrecta."});
            }
            const token = jwt.sign({ user: usuarioEncontrado }, "coderhouse", {
                expiresIn: "1h" // el logueo dura 1 hora
            });
            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });
            usuarioEncontrado.last_connection = new Date();
            await usuarioEncontrado.save();
            res.redirect("/profile");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor al loguear un usuario.");
        }
    }

    async logout(req, res) { // elimina la cookie para desconectar al usuario y redirecciona
        try {
            const { email } = req.user;
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

    async requestPasswordReset(req, res) { // manda un mail al email ingresado y redirecciona
        const { email } = req.body;
        try {
            const user = await UserModel.findOne({ email }); // busco el usuario por email
            if (!user) {
                return res.status(404).render("password-generar", {error: "Usuario no encontrado."}); // si no hay usuario, tiro error y el método termina acá
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
            res.status(500).send("Error interno del servidor."); 
        }
    }

    async cambiarRolPremium(req, res) { // cambia el rol de usuario a premium o viceversa
        const { uid } = req.params; 
        try {
            const user = await UserModel.findById(uid); // busco el usuario por ID 
            if (!user) {
                return res.status(404).send("Usuario no encontrado."); 
            }
            const nuevoRol = user.role === "usuario" ? "premium" : "usuario"; // pero si lo encuentro, le cambio el rol 
            if (nuevoRol === "premium") { // la documentación solo se pide si es de "usuario" --> "premium"
                const documentacionRequerida = ["Identificacion.pdf", "Comprobante de domicilio.pdf", "Comprobante de estado de cuenta.pdf"];
                const userDocuments = user.documents.map(doc => doc.name);
                const tieneDocumentacion = documentacionRequerida.every(doc => userDocuments.includes(doc));
                if (!tieneDocumentacion) {
                    return res.status(400).send("Documentos requeridos no encontrados.");
                } 
            }
            const actualizado = await UserModel.findByIdAndUpdate(uid, {role: nuevoRol}); // actualizo el rol
            res.json(actualizado);  
        } catch (error) {
            console.error(error);
            res.status(500).send("Error en el servidor."); 
        }
    }

    async uploadDocuments(req, res) { // permite subir uno o más archivos, y almacenarlos en las carpetas correspondientes
        //console.log(req.files);
        const { uid } = req.params;
        const uploadedDocuments = req.files;
        try {
            const user = await userRepository.findById(uid);
            if (!user) {
                return res.status(404).send("Usuario no encontrado.");
            }

            if (uploadedDocuments) {
                if (uploadedDocuments.document) {
                    user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }

                if (uploadedDocuments.products) {
                    user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }

                if (uploadedDocuments.profile) {
                    user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })))
                }
            }
            await user.save();
            res.status(200).send("Documentos cargados exitosamente.");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor.");
        }
    }

    async getAllUsers(req, res) { // obtiene todos los usuarios y devuelve el nombre, correo y rol de c/u
        try {
            const users = await UserModel.find({}, "first_name last_name email role");
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor.");
        }
    }

    async deleteLastConnection2Days(req, res) { // elimina los usuarios que no se han conectado durante los 2 días
        try {
            const users = await UserModel.find({ // encuentra a los usuarios inactivos
                last_connection: { $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
            });

            const emails = users.map(user => ({ // guarda los emails de los usuarios inactivos
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            }));

            const result = await UserModel.deleteMany({ // elimina los usuarios inactivos
                last_connection: { $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } // elimina aquellos cuya conexión es menor a la hora actual menos 48hs
            });      

            for (const user of emails) { // envía un mail a los usuarios inactivos
                await emailManager.informarCuentaEliminada(user.email, user.first_name, user.last_name);
            }

            res.json({
                message: "Los usuarios que no se han conectado durante los últimos 2 días han sido eliminados.",
                deletedCount: result.deletedCount
            });        
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor.");
        }
    }

    async deleteUser(req, res) { // elimina un usuario y su carrito, por uid, y además manda un mail al usuario
        const { uid } = req.params;
        try {
            const user = await userRepository.findById(uid); 
            if (!user) {
                return res.status(404).send("Usuario no encontrado.");
            }
            const cid = user.cart?._id;
            cid ?  await CartModel.findByIdAndDelete(cid) : '';
            await emailManager.usuarioEliminadoPorAdmin(user.email, user.first_name, user.last_name);
            const deletedUser = await UserModel.findByIdAndDelete(uid);
            res.json({ message: "Usuario y carrito eliminados correctamente.", deletedUser });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor.");
        }
    }

    async loginWithGoogle(req, res) {
        if (req.user) {
            const token = jwt.sign({ user: req.user }, "coderhouse", {
                expiresIn: "1h"
            });
            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });
            res.redirect("/profile");
        } else {
            //console.error('Error en el callback de Google: Usuario no autenticado');
            res.status(500).send({ status: "error", error: "Error desconocido." });
        }
    }

    async loginWithGithub(req, res) {
        if (req.user) {
            const token = jwt.sign({ user: req.user }, "coderhouse", {
                expiresIn: "1h"
            });
            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });
            res.redirect("/profile");
        } else {
            //console.error('Error en el callback de Github: Usuario no autenticado');
            res.status(500).send({ status: "error", error: "Error desconocido." });
        }
    }
}

export default UserController;