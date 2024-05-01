import CartModel from "../models/carts.model.js";

class CartManager {

    async createCart() {
        try {
            const newCart = new CartModel({products: []});
            await newCart.save();
            return newCart;
        }
        catch (error) {
            console.log("Error al crear un carrito nuevo.", error);
            throw error; 
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                console.log("No hay carrito con ese ID.", error);
                return null;
            }

            return cart;
        } 
        catch (error) {
            console.log("Error al obtener un carrito por ID.", error);
            throw error
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const findProduct = cart.products.find(item => item.product.toString() === productId);
    
            if (findProduct) {
                findProduct.quantity += quantity;
            } 
            else {
                cart.products.push({ product: productId, quantity });
            }

            cart.markModified("products"); // Es importante marcarlo antes de guardarlo para asegurar que los cambios se guarden.
    
            await cart.save();
            return cart;
        }
        catch (error) {
            console.log("Error al agregar un producto.", error);
            throw error
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error("No hay carrito con ese ID.");
            }

            //cart.products = cart.products.filter(item => item.product.toString() !== productId);
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();
            return cart;
        } 
        catch (error) {
            console.error("Error al eliminar un producto del carrito.", error);
            throw error;
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error("No hay carrito con ese ID.");
            }

            cart.products = updatedProducts;
            cart.markModified("products");

            await cart.save();
            return cart;
        } 
        catch (error) {
            console.error("Error al actualizar un carrito.", error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error("No hay carrito con ese ID.");
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;
                cart.markModified("products");

                await cart.save();
                return cart;
            } 
            else {
                throw new Error("Error al buscar un producto en el carrito.");
            }
        } 
        catch (error) {
            console.error("Error al actualizar la cantidad de un producto en el carrito.", error);
            throw error;
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error("No hay carrito con ese ID.");
            }

            return cart;
        } 
        catch (error) {
            console.error("Error al vaciar un carrito.", error);
            throw error;
        }
    }
}

export default CartManager;