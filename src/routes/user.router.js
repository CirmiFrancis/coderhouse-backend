import express from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";
import { fields } from '../middleware/multer.js';

const router = express.Router();
const userController = new UserController();

router.get("/", userController.getAllUsers); // obtiene el nombre, el correo y el rol de todos los usuarios
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin); // renderiza la interfaz de admin si estás autorizado
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] })); // iniciar sesión con GOOGLE
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), userController.loginWithGoogle);
router.get('/github', passport.authenticate('github', { scope: ["user: email"] })); // iniciar sesión con GITHUB
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login', session: false }), userController.loginWithGithub);
router.post("/register", userController.register); // obtiene los datos necesarios para registrar un nuevo usuario, los valida, los agrega a la base de datos y redirecciona
router.post("/login", userController.login); // obtiene email y contraseña, verifica los datos y redirecciona
router.post("/logout", userController.logout.bind(userController)); // modifica el last_connection del usuario, limpia la cookie y redirecciona
router.post("/requestPasswordReset", userController.requestPasswordReset); // obtiene email y redirecciona
router.post("/reset-password", userController.resetPassword); // obtiene email, contraseña y token, actualiza la contraseña y redirecciona
router.post("/:uid/document", fields, userController.uploadDocuments); // obtiene los archivos y los almacena
router.put("/premium/:uid", userController.cambiarRolPremium); // obtiene el id del usuario y actualiza su rol
router.delete("/", userController.deleteLastConnection2Days); // elimina los usuarios que no se conectaron durante los últimos 2 días
router.delete("/:uid", userController.deleteUser); // elimina un usuario y su carrito por uid

export default router;