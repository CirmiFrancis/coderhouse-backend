import ProductRepository from "../repositories/product.repository.js";
const productRepository = new ProductRepository();

class ProductController { // controlador de los productos
    async addProduct(req, res, next) { // agregar un nuevo producto
        const nuevoProducto = req.body;
        try {
            const resultado = await productRepository.agregarProducto(nuevoProducto);
            res.json(resultado);
        } catch (error) {
            next(error);
        }
    }

    async getProducts(req, res) { // obtener todos los productos
        try {
            let { limit = 10, page = 1, sort, query } = req.query;
            const productos = await productRepository.obtenerProductos(limit, page, sort, query);
            res.json(productos);
        } catch (error) { 
            console.error(error);
            res.status(500).send("Error al obtener los productos.");
        }
    }

    async getProductById(req, res) { // obtener un producto por su ID
        const id = req.params.pid;
        try {
            const buscado = await productRepository.obtenerProductoPorId(id);
            if (!buscado) {
                return res.json({
                    error: "Producto no encontrado."
                });
            }
            res.json(buscado);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al obtener el producto por ID.");
        }
    }

    async updateProduct(req, res) { // actualizar un producto por ID
        try {
            const id = req.params.pid;
            const productoActualizado = req.body;
            const resultado = await productRepository.actualizarProducto(id, productoActualizado);
            res.json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al actualizar el producto.");
        }
    }

    async deleteProduct(req, res) { // eliminar un producto por ID
        const id = req.params.pid;
        try {
            let respuesta = await productRepository.eliminarProducto(id);
            res.json(respuesta);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al eliminar el producto.");
        }
    }
}

export default ProductController; 