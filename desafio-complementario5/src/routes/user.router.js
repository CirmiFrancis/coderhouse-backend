import express from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);
router.post("/logout", userController.logout.bind(userController));
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);

// Desafío Complementario 3:
router.post("/reset-password", userController.resetPassword);
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.put("/premium/:uid", userController.cambiarRolPremium);

// desafio complementario 4
//router.post("/:uid/documents", userController.uploadDocuments);

export default router;