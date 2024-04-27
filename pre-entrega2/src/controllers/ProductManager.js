import ProductModel from "../models/products.model.js";

class ProductManager {
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
      console.log("Error al agregar un producto.", error); 
      throw error; 
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } 
    catch (error) {
      console.log("Error al leer los productos.", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);

      if (!product) {
        console.log("Producto NO encontrado.");
        return null;
      } 

      console.log("Producto encontrado.");
      return product;
    } 
    catch (error) {
      console.log("Error al recuperar producto por ID.", error);
      throw error;
    }
  }

  async getProductByCategory(category) {
    try {
      const product = await ProductModel.find({ category: category });

      if (!product) {
        console.log("Productos NO encontrados.");
        return null;
      } 

      console.log("Productos encontrados.");
      return product;
    } 
    catch (error) {
      console.log("Error al recuperar productos por Category.", error);
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const product = await ProductModel.findByIdAndUpdate(id, updatedProduct);

      if (!product) {
        console.log("Producto NO encontrado.");
        return null; 
      }

      console.log("Producto actualizado.");
      return product;
    } 
    catch (error) {
      console.log("Error al actualizar el producto por ID.", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await ProductModel.findByIdAndDelete(id);

      if (!product) {
        console.log("Producto NO encontrado.");
        return null; 
      } 
      console.log("Producto eliminado.");
    } 
    catch (error) {
      console.log("Error al eliminar el producto por ID.", error);
      throw error;
    }
  }
}

export default ProductManager;