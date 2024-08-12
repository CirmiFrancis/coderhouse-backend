import express from "express";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();
const productController = new ProductController();

router.get("/", productController.getProducts); // obtiene todos los productos
router.get("/:pid", productController.getProductById); // obtiene un solo producto por pid
router.post("/", productController.addProduct); // agrega un nuevo producto
router.put("/:pid", productController.updateProduct); // actualiza un producto por pid
router.delete("/:pid", productController.deleteProduct); // elimina un producto por pid

export default router;