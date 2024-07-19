import TicketModel from "../models/ticket.model.js";
import UserModel from "../models/user.model.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import { generateUniqueCode, calcularTotal } from "../utils/cartutils.js";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

class CartController {
    async nuevoCarrito(req, res) {
        try {
            const nuevoCarrito = await cartRepository.crearCarrito();
            res.json(nuevoCarrito);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al crear un carrito.");
        }
    }

    async obtenerProductosDeCarrito(req, res) {
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

    async agregarProductoEnCarrito(req, res) {
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

    async eliminarProductoDeCarrito(req, res) {
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

    async actualizarProductosEnCarrito(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        // Debes enviar un arreglo de productos en el cuerpo de la solicitud
        try {
            const updatedCart = await cartRepository.actualizarProductosEnCarrito(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al actualizar los productos del carrito.");
        }
    }

    async actualizarCantidad(req, res) {
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

    async vaciarCarrito(req, res) {
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

    //Ultima Pre Entrega: 
    async finalizarCompra(req, res) {
        const cartId = req.params.cid;
        try {
            // Obtener el carrito y sus productos
            const cart = await cartRepository.obtenerProductosDeCarrito(cartId);
            const products = cart.products;

            // Inicializar un arreglo para almacenar los productos no disponibles
            const productosNoDisponibles = [];

            // Verificar el stock y actualizar los productos disponibles
            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.obtenerProductoPorId(productId);
                if (product.stock >= item.quantity) {
                    // Si hay suficiente stock, restar la cantidad del producto
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
                    productosNoDisponibles.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            // Crear un ticket con los datos de la compra
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            // Eliminar del carrito los productos que sí se compraron
            cart.products = cart.products.filter(item => productosNoDisponibles.some(productId => productId.equals(item.product)));

            // Guardar el carrito actualizado en la base de datos
            await cart.save();

            res.status(200).json({ productosNoDisponibles });
        } catch (error) {
            console.error(error); // console.error('Error al finalizar la compra:', error);
            res.status(500).json({ error: 'Error al finalizar la compra.' });
        }
    }
}

export default CartController;