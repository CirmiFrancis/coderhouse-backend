const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/CartManager.js");
const cartManager = new CartManager("./src/models/carts.json");

// Creamos un nuevo carrito:
router.post("/carts", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
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
        const carrito = await cartManager.getCarritoById(cartId);
        res.json(carrito.products);
    } 
    catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

// Agregar productos a distintos carritos: 
router.post("/carts/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId,productId, quantity);
        res.json(actualizarCarrito.products);
    } 
    catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

module.exports = router; 