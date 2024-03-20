import express from "express";
const router = express.Router();

import ProductManager from "../controllers/ProductManager.js";
const productManager = new ProductManager("../models/products.json");

app.get("/carts", async (req, res) => {
    try {
        const carts = await productManager.getProducts();
        res.json(carts);
    } 
    catch (error) {
        console.error("Error al obtener los productos.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
})

export default router; 