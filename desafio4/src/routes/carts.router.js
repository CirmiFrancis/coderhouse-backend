import express from "express";
const router = express.Router();

import CartManager from "../controllers/CartManager.js";
const cartManager = new CartManager("./src/models/carts.json");

// Creamos un nuevo carrito
router.post("/carts", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } 
    catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

// Listamos productos que pertenecen a un carrito determinado
router.get("/carts/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } 
    catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

// Agregar productos a distintos carritos 
router.post("/carts/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } 
    catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

export default router;