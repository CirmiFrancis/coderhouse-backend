import express from "express";
const router = express.Router();

import ProductManager from "../controllers/ProductManager.js";
const productManager = new ProductManager("../models/products.json");

app.get("/products", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const productos = await productManager.getProducts();

        if (limit) {
            res.json(productos.slice(0, limit));
        } 
        else {
            res.json(productos);
        }
    } 
    catch (error) {
        console.error("Error al obtener los productos.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
})

app.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const producto = await productManager.getProductById(parseInt(id));

        if (!producto) {
            return res.json({
                error: "Producto no encontrado."
            });
        }

        res.json(producto);
    } 
    catch (error) {
        console.error("Error al obtener el producto.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
})

export default router;