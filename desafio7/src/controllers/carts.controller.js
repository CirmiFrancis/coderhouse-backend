import CartService from "../services/carts.service.js";
const cartService = new CartService();

import respon from "../utils/reusables.js";

class CartController { // consultado por el router

    async createCart(req, res) {
        try {
            await cartService.createCart();
            respon(res, 200, "Carrito creado exitosamente!");
        }
        catch (error) {
            respon(res, 500, "Error al crear un carrito nuevo.");
        }
    }

    async getCartById(req, res) {
        const { cid } = req.params;

        try {
            const cart = await cartService.getCartById(cid);
            return res.json(cart);
        } 
        catch (error) {
            respon(res, 500, "Error al obtener un carrito por ID.");
        }
    }

    async addProductToCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            await cartService.addProductToCart(cid, pid, quantity)
            respon(res, 200, "Producto agregado exitosamente!");
        }
        catch (error) {
            respon(res, 500, "Error al agregar un producto.");
        }
    }

    async deleteProductFromCart(req, res) {
        const { cid, pid } = req.params;

        try {
            await cartService.deleteProductFromCart(cid, pid)
            respon(res, 200, "Producto eliminado exitosamente!");
        } 
        catch (error) {
            respon(res, 500, "Error al eliminar un producto.");
        }
    }

    async updateCart(req, res) {
        const { cid } = req.params;
        const updatedProducts = req.body;

        try {
            await cartService.updateCart(cid, updatedProducts)
            respon(res, 200, "Carrito actualizado exitosamente!");
        } 
        catch (error) {
            respon(res, 500, "Error al actualizar un carrito.");
        }
    }

    async updateProductQuantity(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            await cartService.updateProductQuantity(cid, pid, quantity)
            respon(res, 200, "Cantidad de un producto actualizado exitosamente!");
        } 
        catch (error) {
            respon(res, 500, "Error al actualizar la cantidad de un producto.");
        }
    }

    async emptyCart(req, res) {
        const { cid } = req.params;

        try {
            await cartService.emptyCart(cid)
            respon(res, 200, "Carrito vaciado exitosamente!");
        } 
        catch (error) {
            respon(res, 500, "Error al vaciar un carrito.");
        }
    }
}

export default CartController;