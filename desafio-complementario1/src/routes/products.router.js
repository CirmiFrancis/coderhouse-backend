import express from "express";
const router = express.Router();

import ProductManager from "../controllers/ProductManager.js";
const productManager = new ProductManager();

// Obtengo todos los productos
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            res.json(products.slice(0, limit));
        } 
        else {
            res.json(products);
        }
    } 
    catch (error) {
        console.error("Error al obtener productos.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
});

// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const product = await productManager.getProductById(id);

        if (!product) {
            return res.json({
                error: "Producto NO encontrado."
            });
        }

        res.json(product);
    } 
    catch (error) {
        console.error("Error al obtener producto.", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
    const newProduct = req.body; 

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "El producto se agregó exitosamente (siempre y cuando el 'code' fuese único)."
        });
    } 
    catch (error) {
        console.error("Error al agregar producto.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
});

// Actualizar por ID
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body; 

    try {
        await productManager.updateProduct(id, updatedProduct);
        res.json({
            message: "Producto actualizado correctamente."
        });
    } 
    catch (error) {
        console.error("Error al actualizar producto.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
});

// Eliminar producto por ID
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid; 

    try {
        await productManager.deleteProduct(id);
        res.json({
            message: "Producto eliminado exitosamente."
        });
    } 
    catch (error) {
        console.error("Error al eliminar producto.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
});

export default router;