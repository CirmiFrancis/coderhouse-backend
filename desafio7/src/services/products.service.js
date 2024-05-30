import ProductModel from "../models/products.model.js";

class ProductService { // consultado por el controller

    async createCart() {
        try {
            const newCart = new CartModel({products: []});
            await newCart.save();
            return newCart;
        }
        catch (error) {
            console.error("Error al crear un carrito nuevo:", error); // error que se muestra en consola
            throw error; // error que se muestra a la hora de usar un método HTTP (Postman)
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            return cart;
        } 
        catch (error) {
            console.error("Error al obtener un carrito por ID:", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const findProduct = cart.products.find(item => item.product._id.toString() === productId);
            findProduct ? findProduct.quantity += quantity : cart.products.push({ product: productId, quantity }); // si el producto existe, se le suma la cantidad, sino, se crea un nuevo producto con la cantidad especificada
            cart.markModified("products"); // avisa a mongoose que hubo una modificación
            await cart.save();
            return cart;
        }
        catch (error) {
            console.error("Error al agregar un producto:", error);
            throw error;
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if ( cart.products.find(item => item.product._id.toString() === productId) ) {
                cart.products = cart.products.filter(item => item.product._id.toString() !== productId);
                await cart.save();
                return cart;
            }
            else {
                throw new Error("Producto no encontrado.");
            }
        } 
        catch (error) {
            console.error("Error al eliminar un producto:", error);
            throw error;
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);
            cart.products = updatedProducts;
            cart.markModified("products");
            await cart.save();
            return cart;
        } 
        catch (error) {
            console.error("Error al actualizar un carrito:", error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);
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
            console.error("Error al actualizar la cantidad de un producto:", error);
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

            return cart;

            // ALTERNATIVA
            // const cart = await CartModel.findById(cartId);
            // cart.products = [];
            // cart.markModified("products");
            // await cart.save();
            // return cart;
        } 
        catch (error) {
            console.error("Error al vaciar el carrito:", error);
            throw error;
        }
    }
}

export default CartService;