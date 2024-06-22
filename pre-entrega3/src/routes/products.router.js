// const express = require("express");
// const router = express.Router();
// const ProductController = require("../controllers/product.controller.js");
// const productController = new ProductController(); 

import express from "express";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();
const productController = new ProductController();

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/", productController.addProduct);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

export default router;