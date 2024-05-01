import express from "express";
const router = express.Router();

import ProductManager from "../controllers/ProductManager.js";
import CartManager from "../controllers/CartManager.js";
const productManager = new ProductManager();
const cartManager = new CartManager();

// Renderiza el chat
router.get("/", async (req, res) => {
   res.render("chat");
});

router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 2 } = req.query;
      const products = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const newArray = products.docs.map(product => {
         const { _id, ...rest } = product.toObject();
         return rest;
      });

      res.render("products", {
         products: newArray,
         hasPrevPage: products.hasPrevPage,
         hasNextPage: products.hasNextPage,
         prevPage: products.prevPage,
         nextPage: products.nextPage,
         currentPage: products.page,
         totalPages: products.totalPages
      });
   } 
   catch (error) {
      console.error("Error al obtener productos.", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor."
      });
   }
});

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const cart = await cartManager.getCartById(cartId);

      if (!cart) {
         console.log("No existe un carrito con ese ID.");
         return res.status(404).json({ error: "No existe un carrito con ese ID."});
      }

      const productsInCart = cart.products.map(item => ({
         product: item.product.toObject(), // Lo convertimos a objeto para pasar las restricciones de express-handlebars
         quantity: item.quantity
      }));

      res.render("carts", { products: productsInCart });
   } 
   catch (error) {
      console.error("Error al obtener el carrito.", error);
      res.status(500).json({ error: "Error interno del servidor."});
   }
});

export default router;