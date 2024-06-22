// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const UserController = require("../controllers/user.controller.js");

// const userController = new UserController();

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

export default router;

