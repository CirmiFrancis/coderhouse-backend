import { promises as fs } from "fs";

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
    try {
      const arrayProducts = await this.readFile();

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      if (arrayProducts.some(item => item.code === code)) {
        console.log("El código debe ser único");
        return;
      }

      const newProduct = {
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || []
      };

      if (arrayProducts.length > 0) {
        ProductManager.ultId = arrayProducts.reduce((maxId, product) => Math.max(maxId, product.id), 0);
      }

      newProduct.id = ++ProductManager.ultId; 
      arrayProducts.push(newProduct);
      await this.saveFile(arrayProducts);
    } 
    catch (error) {
      console.log("Error al agregar producto", error);
      throw error; 
    }
  }

  async getProducts() {
    try {
      const arrayProducts = await this.readFile();
      return arrayProducts;
    } 
    catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const arrayProducts = await this.readFile();
      const searched = arrayProducts.find(item => item.id === id);

      if (!searched) {
        console.log("Producto no encontrado");
        return null;
      } 
      else {
        console.log("Producto encontrado");
        return searched;
      }
    } 
    catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  async readFile() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProducts = JSON.parse(respuesta);
      return arrayProducts;
    } 
    catch (error) {
      console.log("Error al leer un archivo", error);
      throw error;
    }
  }

  async saveFile(arrayProducts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
    } 
    catch (error) {
      console.log("Error al guardar el archivo", error);
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const arrayProducts = await this.readFile();
      const index = arrayProducts.findIndex(item => item.id === id);

      if (index !== -1) {
        arrayProducts[index] = { ...arrayProducts[index], ...updatedProduct };
        await this.saveFile(arrayProducts);
        console.log("Producto actualizado");
      } 
      else {
        console.log("No se encontró el producto");
      }
    } 
    catch (error) {
      console.log("Error al actualizar el producto", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProducts = await this.readFile();
      const index = arrayProducts.findIndex(item => item.id === id);

      if (index !== -1) {
        arrayProducts.splice(index, 1);
        await this.saveFile(arrayProducts);
        console.log("Producto eliminado");
      } 
      else {
        console.log("No se encontró el producto");
      }
    } 
    catch (error) {
      console.log("Error al eliminar el producto", error);
      throw error;
    }
  }
}

export default ProductManager;