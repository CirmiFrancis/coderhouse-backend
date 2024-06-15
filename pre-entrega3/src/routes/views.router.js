import express from "express";
const router = express.Router();

import ViewController from "../controllers/views.controller.js";
const viewController = new ViewController();

router.get("/", viewController.renderLogin)
router.get("/register", viewController.renderRegister)
router.get("/failedregister", viewController.renderFailedRegister)
router.get("/products", viewController.renderProducts)
router.get("/carts/:cid", viewController.renderCartProducts)

export default router;