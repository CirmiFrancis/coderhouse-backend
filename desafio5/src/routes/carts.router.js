import express from "express";
const router = express.Router();

import CartManager from "../controllers/CartManager.js";
const cartManager = new CartManager();

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

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            console.log("No hay carrito con ese ID.");
            return res.status(404).json({ error: "No hay carrito con ese ID." });
        }

        res.json(cart.products);
    } 
    catch (error) {
        console.error("Error al obtener el carrito.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
});

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

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.deleteProductFromCart(cartId, productId);

        res.json({
            status: 'success',
            message: 'Producto eliminado del carrito.',
            updatedCart,
        });
    } 
    catch (error) {
        console.error('Error al eliminar un producto del carrito.', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor.',
        });
    }
});

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
        const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
        res.json(updatedCart);
    } 
    catch (error) {
        console.error('Error al actualizar el carrito.', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor.',
        });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'Cantidad del producto actualizada.',
            updatedCart,
        });
    } 
    catch (error) {
        console.error('Error al actualizar la cantidad de un producto del carrito.', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor.',
        });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        const updatedCart = await cartManager.emptyCart(cartId);

        res.json({
            status: 'success',
            message: 'Todos los productos del carrito fueron eliminados correctamente.',
            updatedCart,
        });
    } 
    catch (error) {
        console.error('Error al vaciar el carrito.', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor.',
        });
    }
});

export default router;