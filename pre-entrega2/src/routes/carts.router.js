import express from "express";
const router = express.Router();

import CartManager from "../controllers/CartManager.js";
const cartManager = new CartManager();

// Creamos un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } 
    catch (error) {
        console.error("Error al crear un nuevo carrito.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
});

// Listamos productos que pertenecen a un carrito determinado
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } 
    catch (error) {
        console.error("Error al obtener el carrito.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
});

// Agregamos productos a distintos carritos 
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } 
    catch (error) {
        console.error("Error al agregar producto al carrito.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
});

export default router;