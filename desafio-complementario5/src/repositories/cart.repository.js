import CartModel from "../models/cart.model.js";

class CartRepository {
    async crearCarrito() { // crea un nuevo carrito vacío
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.error(error);
            throw new Error("Error al crear un nuevo carrito.");
        }
    }

    async obtenerProductosDeCarrito(idCarrito) { // obtiene los productos de un carrito
        try {
            const carrito = await CartModel.findById(idCarrito);
            if (!carrito) {
                console.warning("No existe ese carrito con el ID proporcionado.");
                return null;
            }
            return carrito;
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener los productos de un carrito.");
        }
    }

    async agregarProducto(cartId, productId, quantity = 1) { // agrega un nuevo producto al carrito
        try {
            const carrito = await this.obtenerProductosDeCarrito(cartId);
            const existeProducto = carrito.products.find(item => item.product._id.toString() === productId);
            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error(error);
            throw new Error("Error al agregar un producto al carrito.");
        }
    }

    async eliminarProducto(cartId, productId) { // elimina un producto del carrito
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            console.error(error);
            throw new Error("Error al eliminar un producto del carrito.");
        }
    }

    async actualizarProductosEnCarrito(cartId, updatedProducts) { // actualiza los productos de un carrito
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }

            cart.products = updatedProducts;
            cart.markModified('products');
            await cart.save();
            return cart;
        } catch (error) {
            console.error(error);
            throw new Error("Error al actualizar los productos del carrito.");
        }
    }

    async actualizarCantidadesEnCarrito(cartId, productId, newQuantity) { // actualiza las cantidades de un producto en el carrito
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;

                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito.');
            }
        } catch (error) {
            console.error(error);
            throw new Error("Error al actualizar las cantidades de un producto en el carrito.");
        }
    }

    async vaciarCarrito(cartId) { // vacia un carrito
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );
            if (!cart) {
                throw new Error('Carrito no encontrado.');
            }
            return cart;
        } catch (error) {
            console.error(error);
            throw new Error("Error al vaciar el carrito.");
        }
    }
}

export default CartRepository;