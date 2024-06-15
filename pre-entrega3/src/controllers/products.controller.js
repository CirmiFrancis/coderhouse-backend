import ProductService from "../services/products.service.js";
const productService = new ProductService();

import respon from "../utils/reusables.js";

class ProductController { // consultado por el router

  async addProduct(req, res) {
    const { title, description, price, img, code, stock, category, thumbnails } = req.body; 

    try {
        await productService.addProduct({title, description, price, img, code, stock, category, thumbnails});
        respon(res, 200, "El producto se agregó exitosamente! (siempre y cuando el 'code' fuese único)");
    }
    catch (error) {
      respon(res, 500, "Error al agregar un producto.");
    }
  }

  async getProducts(req, res) {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const products = await productService.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } 
    catch (error) {
      respon(res, 500, "Error al obtener los productos.");
    }
  }

  async getProductById(req, res) {
    const { pid } = req.params;

    try {
        const product = await productService.getProductById(pid);
        res.json(product);
    } 
    catch (error) {
      respon(res, 500, "Error al obtener un producto.");
    }
  }

  async updateProduct(req, res) {
    const { pid } = req.params;
    const updatedProduct = req.body; 

    try {
        await productService.updateProduct(pid, updatedProduct);
        respon(res, 200, "Producto actualizado exitosamente!");
    } 
    catch (error) {
      respon(res, 500, "Error al actualizar un producto.");
    }
  }

  async deleteProduct(req, res) {
    const { pid } = req.params; 

    try {
        await productService.deleteProduct(pid);
        respon(res, 200, "Producto eliminado exitosamente!");
    } 
    catch (error) {
      respon(res, 500, "Error al eliminar un producto.");
    }
  }

}

export default ProductController;