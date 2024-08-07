import ProductModel from "../models/product.model.js";
import CartRepository from "../repositories/cart.repository.js";

const cartRepository = new CartRepository();

class ViewsController {
    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 4 } = req.query;

            const skip = (page - 1) * limit;

            const productos = await ProductModel
                .find()
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments();

            const totalPages = Math.ceil(totalProducts / limit);

            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            const nuevoArray = productos.map(producto => {
                const { _id, ...rest } = producto.toObject();
                return { id: _id, ...rest }; // Agregar el ID al objeto
            });

            const cartId = req.user.cart.toString();
            //console.info(cartId);
            const userID = req.user._id.toString(); // Desafío Complementario 3
            //console.log( typeof(userID) ); 
            //console.log( typeof(productos[productos.length-1]["owner"]) ); 
            //console.log( userID === productos[productos.length-1]["owner"] ); 

            res.render("products", {
                productos: nuevoArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId,
                userID // Desafío Complementario 3
            });

        } catch (error) {
            console.error(error); // console.error("Error al obtener productos", error);
            res.status(500).json({
                status: 'error',
                error: "Error interno del servidor al renderizar los productos."
            });
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const carrito = await cartRepository.obtenerProductosDeCarrito(cartId);

            if (!carrito) {
                console.warning("No existe ese carrito con el ID especificado.");
                return res.status(404).json({ error: "Carrito no encontrado." });
            }

            let totalCompra = 0;

            const productosEnCarrito = carrito.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;

                totalCompra += totalPrice;

                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });

            res.render("carts", { productos: productosEnCarrito, totalCompra, cartId });
        } catch (error) {
            console.error(error); // console.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor al renderizar el carrito." });
        }
    }

    async renderLogin(req, res) {
        res.render("login");
    }

    async renderRegister(req, res) {
        res.render("register");
    }

    async renderRealTimeProducts(req, res) {
        const user = req.user;
        try {
            res.render("realtimeproducts", { userRole: user.role, userID: user._id });
        } catch (error) {
            console.error("Error en la vista realtimeproducts:", error);
            res.status(500).json({ error: "Error interno del servidor al renderizar los productos en tiempo real." });
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }

    async showLoggerTest(req, res) {
        req.logger.fatal("Mensaje FATAL"); 
        req.logger.error("Mensaje ERROR");
        req.logger.warning("Mensaje WARNING"); 
        req.logger.info("Mensaje INFO"); 
        req.logger.http("Mensaje HTTP"); 
        req.logger.debug("Mensaje DEBUG"); 

        res.send("Logs Generados");
    }

    // Desafío Complementario 3: 
    async renderResetPassword(req, res){
        res.render("password-generar"); 
    }

    async renderConfirmacion(req, res){
        res.render("password-confirmacion"); 
    }

    async renderCambioPassword(req, res){
        res.render("password-restablecer"); 
    }
}

export default ViewsController;