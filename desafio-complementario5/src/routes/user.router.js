import express from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";

const router = express.Router();
const userController = new UserController();

router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile); // renderiza profile, pasando datos del usuario
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin); // renderiza la interfaz de admin si estás autorizado
router.post("/register", userController.register); // obtiene los datos necesarios para registrar un nuevo usuario, los valida, los agrega a la base de datos y redirecciona
router.post("/login", userController.login); // obtiene email y contraseña, verifica los datos y redirecciona
router.post("/logout", userController.logout.bind(userController)); // modifica el last_connection del usuario, limpia la cookie y redirecciona
router.post("/requestPasswordReset", userController.requestPasswordReset); // obtiene email y redirecciona
router.post("/reset-password", userController.resetPassword); // obtiene email, contraseña y token, actualiza la contraseña y redirecciona
router.put("/premium/:uid", userController.cambiarRolPremium); // obtiene el id del usuario y actualiza su rol

// desafio complementario 4
//router.post("/:uid/documents", userController.uploadDocuments);

export default router;