import { promises as fs } from "fs";

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.ultId = 0;

        this.loadCart(); // cargar los carritos almacenados en el archivo
    }

    async loadCart() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);

            if (this.carts.length > 0) { // verifico si hay por lo menos un carrito creado
                this.ultId = Math.max(...this.carts.map(cart => cart.id)); // utilizo el método map para crear un array qeu solo tengo los identificadores del carrito y con math.max obtengo el mayor 
            }
        } 
        catch (error) {
            console.log("Error al crear los carritos: ", error);
            await this.saveCart(); // si no existe el archivo, lo voy a crear
        }
    }

    async saveCart() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        const newCart = {
            id: ++this.ultId,
            products: []
        }

        this.carts.push(newCart);
        await this.saveCart(); // guardamos el array en el archivo
        return newCart;
    }

    async getCartById(cartId) {
        try {
            const cart = this.carts.find(c => c.id === cartId);

            if (!cart) {
                console.log("No hay carrito con ese id");
                return;
            }

            return cart;
        } 
        catch (error) {
            console.log("Error al obtener un carrito por id: ", error);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const findProduct = carrito.products.find(p => p.product === productId);

        if (findProduct) {
            findProduct.quantity += quantity;
        } 
        else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveCart();
        return cart;
    }
}

export default CartManager;