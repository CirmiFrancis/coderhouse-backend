import { promises as fs } from 'fs';

class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(nuevoObjeto) { //agregamos los productos
        let {title, description, price, img, code, stock} = nuevoObjeto;

        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Por favor, completa todos los campos.");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log(`El código ${code} ya está asignado a un producto. Por favor, ingrese otro código.`);
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }

        this.products.push(newProduct);

        await this.guardarArchivo(this.products);
    }

    async getProducts() { //obtenemos los productos
        try {
            const arrayProductos = await this.leerArchivo();
            
            return arrayProductos;
        } 
        catch (error) {
            console.log("Error al leer el archivo.", error);
        }
    }

    async getProductById(id) { //teniendo el array, buscamos un producto por su id
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no encontrado.");
            } 
            else {
                console.log(`Producto encontrado.`);
                return buscado;
            }
        } 
        catch (error) {
            console.log("Error al leer el archivo ", error);
        }
    }

    async leerArchivo() { //leemos los productos (parse)
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);

            return arrayProductos;
        } 
        catch (error) {
            console.log("Error al leer el archivo con los productos.", error);
        }
    }

    async guardarArchivo(arrayProductos) { //guardar productos en JSON (stringify)
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } 
        catch (error) {
            console.log("Error al guardar el archivo con los productos.", error);
        }
    }

    async updateProduct(id, productoActualizado) { //actualiza la información del producto que coincida con el id
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1, productoActualizado);
                await this.guardarArchivo(arrayProductos);
            } 
            else {
                console.log("Producto no encontrado para actualizar.");
            }
        } 
        catch (error) {
            console.log("Error al actualizar el producto.", error);
        }
    }

    async deleteProduct(id){ //eliminamos el producto con el id que coincida y actualizamos el array
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.some(item => item.id === id);

            if (index) {
                arrayProductos.filter(item => item.id !== id);
                await this.guardarArchivo(arrayProductos);
            }
            else {
                console.log("Producto no encontrado para eliminar.");
            }
        }
        catch (error) {
            console.log("Error al eliminar el archivo.", error);
        }
    }
}

export default ProductManager;