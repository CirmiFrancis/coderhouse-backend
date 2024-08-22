import TicketModel from "../models/ticket.model.js";
import UserModel from "../models/user.model.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import { generateUniqueCode, calcularTotal } from "../utils/cartutils.js";
import { enviarCorreoCompra } from "../services/email.js";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

class CartController { // controlador de carritos
    async nuevoCarrito(req, res) { // crea un nuevo carrito
        try {
            const nuevoCarrito = await cartRepository.crearCarrito();
            res.json(nuevoCarrito);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al crear un carrito.");
        }
    }

    async obtenerProductosDeCarrito(req, res) { // obtiene todos los productos de un carrito
        const carritoId = req.params.cid;
        try {
            const productos = await cartRepository.obtenerProductosDeCarrito(carritoId);
            if (!productos) {
                return res.status(404).json({ error: "Carrito no encontrado." });
            }
            res.json(productos);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al obtener productos de un carrito.");
        }
    }

    async agregarProductoEnCarrito(req, res) { // agrega un producto al carrito
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            await cartRepository.agregarProducto(cartId, productId, quantity);
            const carritoID = (req.user.cart).toString();
            
            res.redirect(`/carts/${carritoID}`)
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al agregar un producto al carrito.");
        }
    }

    async eliminarProductoDeCarrito(req, res) { // elimina un producto del carrito
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartRepository.eliminarProducto(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente.',
                updatedCart,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al eliminar un producto del carrito.");
        }
    }

    async actualizarProductosEnCarrito(req, res) { // actualiza los productos de un carrito
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        try {
            const updatedCart = await cartRepository.actualizarProductosEnCarrito(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al actualizar los productos del carrito.");
        }
    }

    async actualizarCantidad(req, res) { // actualiza la cantidad de un producto en el carrito
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartRepository.actualizarCantidadesEnCarrito(cartId, productId, newQuantity);
            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente.',
                updatedCart,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al actualizar la cantidad de productos del carrito.");
        }
    }

    async vaciarCarrito(req, res) { // vacia un carrito
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRepository.vaciarCarrito(cartId);
            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente.',
                updatedCart,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al vaciar el carrito.");
        }
    }

    async finalizarCompra(req, res) { // finaliza una compra
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.obtenerProductosDeCarrito(cartId); // obtener el carrito
            const products = cart.products; // obtener los productos
            const productosNoDisponibles = []; // array para almacenar los productos no disponibles
            
            if (products.length === 0) { // tira error al estar el carrito vacío
                return res.status(400).json({ error: "Carrito vacío. Agrega al menos un producto." });
            }
            
            for (const item of products) { // verificar el stock y actualizar los productos disponibles
                const productId = item.product;
                const product = await productRepository.obtenerProductoPorId(productId);
                if (product.stock >= item.quantity) { // si hay suficiente stock, restar la cantidad del producto
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    productosNoDisponibles.push(productId); // si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });
            const ticket = new TicketModel({  // crear un ticket con los datos de la compra
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            cart.products = cart.products.filter(item => productosNoDisponibles.some(productId => productId.equals(item.product))); // eliminar del carrito los productos que sí se compraron

            await cart.save(); // guardar el carrito actualizado en la base de datos
            await enviarCorreoCompra(userWithCart.email, userWithCart.first_name, ticket._id); // enviar correo de compra

            // res.render("checkout", { // renderizar la vista de compra con los datos
            //     cliente: userWithCart.first_name,
            //     email: userWithCart.email,
            //     numTicket: ticket._id 
            // });

            res.status(200).json({ // devuelve el status 200 y los datos de la compra
                message: "Operación exitosa",
                data: { cliente: userWithCart.first_name, email: userWithCart.email, numTicket: ticket._id  }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al finalizar la compra.' });
        }
    }
}

export default CartController;