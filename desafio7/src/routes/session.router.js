import express from "express";
import passport from "passport";
const router = express.Router();

// import CartController from "../controllers/carts.controller.js";
// const cartController = new CartController();

// import CartService from "../services/carts.service.js";
// const cartService = new CartService();

import SessionController from "../controllers/sessions.controller.js";

router.get("/logout", SessionController.logout); // ¿Cambiar por cartController?
router.post("/login", SessionController.login);
router.get("/faillogin", SessionController.failLogin);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/" }), SessionController.githubCallback);

router.get('/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), SessionController.googleCallback);

export default router; 