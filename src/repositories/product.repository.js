import ProductModel from "../models/product.model.js";
import CustomError from "../services/errors/custom-error.js";
import generarInfoError from "../services/errors/info.js";
import { EErrors } from "../services/errors/enum.js";

class ProductRepository {
    async agregarProducto({ title, description, price, img, code, stock, category, thumbnails, owner }) { // agrega un producto siempre y cuando cada campo cumpla con los requisitos
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                throw CustomError.crearError({
                    nombre: "Agregar producto", 
                    causa: generarInfoError({title, description, price, code, stock, category, owner}),
                    mensaje: "Error al intentar crear un producto.", 
                    codigo: EErrors.TIPO_INVALIDO
                });
            }
            
            const existeProducto = await ProductModel.findOne({ code: code });
            if (existeProducto) {
                throw CustomError.crearError({
                    nombre: "Agregar producto",
                    causa: `El código ${code} ya existe.`,
                    mensaje: "El código debe ser único.",
                    codigo: EErrors.TIPO_INVALIDO
                });
            }

            const newProduct = new ProductModel({ // crea un nuevo producto
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || [],
                owner
            });

            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error(error);
        }
    }

    async obtenerProductos(limit = 10, page = 1, sort, query) { // obtiene todos los productos con la página actual, un límite, un orden y un filtro
        try {
            const skip = (page - 1) * limit; // desplazamiento de página

            let queryOptions = {}; // filtro
            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {}; // orden
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const productos = await ProductModel // consulta a la base de datos
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions); // paginación
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            
            return { // retorno
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener los productos.");
        }
    }

    async obtenerProductoPorId(id) { // obtener producto por id
        try {
            const producto = await ProductModel.findById(id);
            if (!producto) {
                console.warning("Producto no encontrado.");
                return null;
            }
            console.info("Producto encontrado.");
            return producto;
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener el producto por ID.");
        }
    }

    async actualizarProducto(id, productoActualizado) { // actualizar un producto por id
        try {
            const actualizado = await ProductModel.findByIdAndUpdate(id, productoActualizado);
            if (!actualizado) {
                console.warning("Producto no encontrado.");
                return null;
            }
            console.info("Producto actualizado.");
            return actualizado;
        } catch (error) {
            console.error(error);
            throw new Error("Error al actualizar el producto.");
        }
    }

    async eliminarProducto(id) { // eliminar un producto por id
        try {
            const deleteado = await ProductModel.findByIdAndDelete(id);
            if (!deleteado) {
                console.warning("Producto no encontrado.");
                return null;
            }
            console.info("Producto eliminado correctamente.");
            return deleteado;
        } catch (error) {
            console.error(error);
            throw new Error("Error al eliminar el producto.");
        }
    }
}

export default ProductRepository;