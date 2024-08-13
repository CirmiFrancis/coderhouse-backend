import express from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";
import { fields } from '../middleware/multer.js';

const router = express.Router();
const userController = new UserController();

router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin); // renderiza la interfaz de admin si estás autorizado
router.post("/register", userController.register); // obtiene los datos necesarios para registrar un nuevo usuario, los valida, los agrega a la base de datos y redirecciona
router.post("/login", userController.login); // obtiene email y contraseña, verifica los datos y redirecciona
router.post("/logout", userController.logout.bind(userController)); // modifica el last_connection del usuario, limpia la cookie y redirecciona
router.post("/requestPasswordReset", userController.requestPasswordReset); // obtiene email y redirecciona
router.post("/reset-password", userController.resetPassword); // obtiene email, contraseña y token, actualiza la contraseña y redirecciona
router.post("/:uid/document", fields, userController.uploadDocuments); // obtiene los archivos y los almacena
router.put("/premium/:uid", userController.cambiarRolPremium); // obtiene el id del usuario y actualiza su rol

export default router;