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

            cart.markModified("products");
    
            await cart.save();
            return cart;
        }
        catch (error) {
            console.log("Error al agregar un producto.", error);
            throw error
        }
    }
}

export default CartManager;