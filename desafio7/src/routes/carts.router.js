import express from "express";
const router = express.Router();

import CartManager from "../controllers/carts.controller.js";
const cartManager = new CartManager();

router.post("/", cartManager.createCart);
router.get("/:cid", cartManager.getCartById);
router.post("/:cid/product/:pid", cartManager.addProductToCart);
router.delete("/:cid/product/:pid", cartManager.deleteProductFromCart);
router.put("/:cid", cartManager.updateCart);
router.put("/:cid/product/:pid", cartManager.updateProductQuantity);
router.delete("/:cid", cartManager.emptyCart);

export default router;