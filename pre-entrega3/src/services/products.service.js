import ProductModel from "../models/products.model.js";

class ProductService { // consultado por el controller

    async addProduct({title, description, price, img, code, stock, category, thumbnails}) {
        try {
            if(!title|| !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios.");
                return; 
            }
    
            const existsProduct = await ProductModel.findOne({code: code});
    
            if(existsProduct) {
                console.log("El código debe ser único.");
                return;
            }
    
            const newProduct = new ProductModel({
                title, 
                description, 
                price, 
                img, 
                code,
                stock, 
                category, 
                status: true, 
                thumbnails: thumbnails || []
            });
    
            await newProduct.save(); 
        } 
        catch (error) {
            console.error("Error al agregar un producto.", error); 
            throw error; 
        }
    }
    
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;
            let queryOptions = {};
            query ? queryOptions = { category: query } : '';
            const sortOptions = {};
        
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }
        
            const products = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);
            const totalProducts = await ProductModel.countDocuments(queryOptions);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
        
            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            }
        } 
        catch (error) {
            console.error("Error al obtener los productos.", error);
            throw error;
        }
    }
    
    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            console.log("Producto encontrado.");
            return product;
        } 
        catch (error) {
            console.error("Error al recuperar producto por ID.", error);
            throw error;
        }
    }
    
    async updateProduct(id, updatedProduct) {
        try {
            const product = await ProductModel.findByIdAndUpdate(id, updatedProduct);
            console.log("Producto actualizado.");
            return product;
        } 
        catch (error) {
            console.error("Error al actualizar el producto por ID.", error);
            throw error;
        }
    }
    
    async deleteProduct(id) {
        try {
            await ProductModel.findByIdAndDelete(id);
            console.log("Producto eliminado.");
        } 
        catch (error) {
            console.error("Error al eliminar el producto por ID.", error);
            throw error;
        }
    }

}

export default ProductService;