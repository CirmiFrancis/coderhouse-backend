// const express = require("express");
// const router = express.Router();
// const ViewsController = require("../controllers/view.controller.js");
// const viewsController = new ViewsController();
// const checkUserRole = require("../middleware/checkrole.js");
// const passport = require("passport");

import express from "express";
import passport from "passport";
import ViewsController from "../controllers/view.controller.js";
import checkUserRole from "../middleware/checkrole.js";

const router = express.Router();
const viewsController = new ViewsController();

router.get("/products", checkUserRole(['usuario']),passport.authenticate('jwt', { session: false }), viewsController.renderProducts);

router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/realtimeproducts", checkUserRole(['admin']), viewsController.renderRealTimeProducts);
router.get("/chat", checkUserRole(['usuario']) ,viewsController.renderChat);
router.get("/", viewsController.renderHome);

export default router;