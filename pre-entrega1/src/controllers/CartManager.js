const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.ultId = 0;

        this.cargarCarritos(); // cargar los carritos almacenados en el archivo
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);

            if (this.carts.length > 0) { // verifico si hay por lo menos un carrito creado
                this.ultId = Math.max(...this.carts.map(cart => cart.id)); // utilizo el método map para crear un array qeu solo tengo los identificadores del carrito y con math.max obtengo el mayor 
            }
        } 
        catch (error) {
            console.log("Error al crear los carritos: ", error);
            await this.guardarCarritos(); // si no existe el archivo, lo voy a crear
        }
    }

    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        }

        this.carts.push(nuevoCarrito);
        await this.guardarCarritos(); // guardamos el array en el archivo
        return nuevoCarrito;
    }

    async getCarritoById(carritoId) {
        try {
            const carrito = this.carts.find(c => c.id === carritoId);

            if (!carrito) {
                console.log("No hay carrito con ese id");
                return;
            }

            return carrito;
        } 
        catch (error) {
            console.log("Error al obtener un carrito por id: ", error);
        }
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
        const carrito = await this.getCarritoById(carritoId);
        const existeProducto = carrito.products.find(p => p.product === productoId);

        if (existeProducto) {
            existeProducto.quantity += quantity;
        } 
        else {
            carrito.products.push({ product: productoId, quantity });
        }

        await this.guardarCarritos();
        return carrito;
    }
}

module.exports = CartManager;