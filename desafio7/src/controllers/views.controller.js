// import ProductController from "../controllers/products.controller.js";
// const productController = new ProductController();

import ProductService from "../services/products.service.js";
const productService = new ProductService();

import CartController from "../controllers/carts.controller.js";
const cartController = new CartController();

class ViewController { // consultado por el router

    async renderLogin(req, res) {
        if (req.session.login) {
            return res.redirect("/products");
        } 
        else {
            res.render("login");
        }
    }

    renderRegister(req, res) {
        if (req.session.login) {
           return res.redirect("/products");
        } 
        else {
           res.render("register");
        }
    }

    renderFailedRegister(req, res) {
        res.send("Registro fallido.");
    }
 
    async renderProducts(req, res) {
        if (!req.session.login) {
            return res.redirect("/");
        }

        try {
            const { page = 1, limit = 2 } = req.query;
            const products = await productService.getProducts({ // ¿Cambiar por productController?
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
                cart: req.session.user.cart,
                role: req.session.user.role
            });
        } 
        catch (error) {
            respon(res, 500, "Error al obtener los productos.");
        }
    }

    async renderCartProducts(req, res) {
        const cartId = req.params.cid;

        try {
            const cart = await cartController.getCartById(cartId);

            const productsInCart = cart.products.map(item => ({
                product: item.product.toObject(),
                quantity: item.quantity
            }));

            res.render("carts", { products: productsInCart });
        } 
        catch (error) {
            respon(res, 500, "Error al obtener el carrito.");
        }
    }
 
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

}

export default ViewController;