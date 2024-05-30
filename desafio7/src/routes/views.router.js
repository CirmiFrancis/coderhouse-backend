import express from "express";
const router = express.Router();

import ProductManager from "../controllers/products.controller.js";
import CartManager from "../controllers/carts.controller.js";
const productManager = new ProductManager();
const cartManager = new CartManager();

// Renderiza el login
router.get("/", async (req, res) => {
   if (req.session.login) {
      return res.redirect("/products");
   }
   else {
      res.render("login");
   }
});

router.get("/register", (req, res) => { // si estoy logueado, voy a productos
   if(req.session.login) {
      return res.redirect("/products");
   }

   res.render("register");
})

router.get("/failedregister", (req, res) => {
   res.send("Registro fallido.");
})

// Renderiza productos
router.get("/products", async (req, res) => {
   if (!req.session.login) {
      return res.redirect("/");
   }

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
         totalPages: products.totalPages,

         last_name: req.session.user.last_name, 
         first_name: req.session.user.first_name, 
         age: req.session.user.age,
         cart: req.session.user.cart, // necesario para poder mostrar en las views (no se debería de mostrar al ser considerado información sensible, pero sirve a la hora de programar para saber que estoy haciendo las cosas bien)
         role: req.session.user.role
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

// Renderiza productos de un cart
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

// Renderiza login
// router.get("/login", (req, res) => { // si estoy logueado, voy a productos
//    if(req.session.login) {
//       return res.redirect("/products");
//    }
   
//    res.render("login");
// })

// router.get("/profile", (req, res) => { // si no estoy logueado, voy a login
//    if (!req.session.login) {
//        return res.redirect("/login");
//    }

//    res.render("profile", { // pasamos el apellido, el nombre y la edad para mostrarlos en el perfil
//        last_name: req.session.user.last_name, 
//        first_name: req.session.user.first_name, 
//        age: req.session.user.age
//    });
// })

export default router;