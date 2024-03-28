const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/products.json");

// Obtengo todos los productos del JSON
router.get("/products", async (req, res) => {
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
        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

// Obtener un producto por ID
router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const product = await productManager.getProductById(parseInt(id));

        if (!product) {
            return res.json({
                error: "Producto no encontrado"
            });
        }

        res.json(product);
    } 
    catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

// Agregar un nuevo producto
router.post("/products", async (req, res) => {
    const newProduct = req.body; 

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({message: "Producto agregado exitosamente"});
    } 
    catch (error) {
        res.status(500).json({error: "Error interno del servidor"});
    }
})

// Actualizar por ID
router.put("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body; 

    try {
        await productManager.updateProduct(parseInt(id), updatedProduct);
        res.json({
            message: "Producto actualizado correctamente"
        });
    } 
    catch (error) {
        res.status(500).json({error: "Error interno del servidor"});
    }
})

// Eliminar producto
router.delete("/products/:pid", async (req, res) => {
    const id = req.params.pid; 

    try {
        await productManager.deleteProduct(parseInt(id));
        res.json({
            message: "Producto eliminado exitosamente"
        });
    } 
    catch (error) {
        res.status(500).json({error: "Error interno del servidor"});
    }
})

module.exports = router; 