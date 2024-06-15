import express from "express";
import passport from "passport";
const router = express.Router();

import SessionController from "../controllers/sessions.controller.js";
const sessionController = new SessionController();

router.get("/logout", sessionController.logout);
router.post("/login", sessionController.login);
router.get("/faillogin", sessionController.failLogin);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/" }), sessionController.githubCallback);

router.get('/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), sessionController.googleCallback);

export default router; 