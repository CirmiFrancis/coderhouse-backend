import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import CartRepository from "../repositories/cart.repository.js";
import UserDTO from "../dto/user.dto.js";

const cartRepository = new CartRepository();

class ViewsController { // controlador de las vistas
    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 12 } = req.query; // limito a 12 los productos por página e ingreso a la página 1 por defecto
            
            const skip = (page - 1) * limit;
            const productos = await ProductModel.find().skip(skip).limit(limit);

            const totalProducts = await ProductModel.countDocuments();
            const totalPages = Math.ceil(totalProducts / limit);

            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            const nuevoArray = productos.map(producto => {
                const { _id, ...rest } = producto.toObject();
                return { id: _id, ...rest }; // agregar el ID al objeto
            });

            const cartId = req.user.cart.toString();
            //console.info(cartId);
            const userID = req.user._id.toString();
            //console.log( typeof(userID) ); 
            //console.log( typeof(productos[productos.length-1]["owner"]) ); 
            //console.log( userID === productos[productos.length-1]["owner"] ); 

            res.render("products", { // renderiza products.handlebars y le pasa los datos
                productos: nuevoArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId,
                userID
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 'error',
                error: "Error interno del servidor al renderizar los productos."
            });
        }
    }

    async renderCart(req, res) { // renderiza cart.handlebars y le pasa los datos
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
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor al renderizar el carrito." });
        }
    }

    async renderLogin(req, res) { // renderiza login.handlebars
        res.render("login");
    }

    async renderRegister(req, res) { // renderiza register.handlebars
        res.render("register");
    }

    async renderProfile(req, res) { // renderizo profile.handlebars y paso datos del usuario
        try {
            const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role); // con DTO
            const isAdmin = req.user.role === 'admin';
            const isPremium = req.user.role === 'premium';
            res.render("profile", { user: userDto, isAdmin, isPremium });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor.');
        }
    }

    async renderRealTimeProducts(req, res) { // renderiza realtimeproducts.handlebars y le pasa los datos
        const user = req.user;
        try {
            const productos = await ProductModel.find().sort({ code: 1 });
            const nuevoArray = productos.map(producto => {
                const { _id, ...rest } = producto.toObject();
                return { id: _id, ...rest };
            });
            res.render("realtimeproducts", { adminproducts: nuevoArray, userRole: user.role, userID: user._id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor al renderizar los productos en tiempo real." });
        }
    }

    async renderChat(req, res) { // renderiza chat.handlebars
        res.render("chat");
    }

    async renderHome(req, res) { // renderiza home.handlebars
        res.render("home");
    }

    async showLoggerTest(req, res) { // loggers
        req.logger.fatal("Mensaje FATAL"); 
        req.logger.error("Mensaje ERROR");
        req.logger.warning("Mensaje WARNING"); 
        req.logger.info("Mensaje INFO"); 
        req.logger.http("Mensaje HTTP"); 
        req.logger.debug("Mensaje DEBUG"); 
        res.send("Logs Generados");
    }

    async renderResetPassword(req, res){ // renderiza password-generar.handlebars
        res.render("password-generar"); 
    }

    async renderConfirmacion(req, res){ // renderiza password-confirmacion.handlebars
        res.render("password-confirmacion");
    }

    async renderCambioPassword(req, res){ // renderiza password-restablecer.handlebars
        res.render("password-restablecer"); 
    }

    async adminUsers(req, res){ // renderiza adminusers.handlebars y le pasa los datos de cada usuario
        try {
            const users = await UserModel.find({}, "email role first_name last_name age");
            const arrayUsers = users.map(user => {
                const { _id, ...rest } = user.toObject();
                return { id: _id, ...rest };
            });
            res.render("adminusers", { usuarios: arrayUsers });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor.");
        }
    }

    async preCheckout(req, res){ // renderiza checkout-pre.handlebars
        res.render("checkout-pre"); 
    }

    async checkout(req, res){ // renderiza checkout.handlebars
        res.render("checkout"); 
    }

    async error(req, res){ // renderiza error.handlebars
        res.render("error"); 
    }
}

export default ViewsController;