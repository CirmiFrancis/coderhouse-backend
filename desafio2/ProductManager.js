// ================== CÓDIGO ==================

const fs = require("fs"); //cargamos el File System de Node.js

class ProductManager {
    static ultId = 0;
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if(!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Por favor, completa todos los campos.");
            return;
        }
    
        if(this.products.some(item => item.code === code)) {
            console.log(`El código ${code} ya está asignado a un producto. Por favor, ingrese otro código.`);
            return;
        }
        
        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price, 
            thumbnail,
            code,
            stock
        }

        this.products.push(newProduct);
        this.saveProducts();
    }

    saveProducts() { //guardar productos en JSON
        fs.writeFile(this.path, JSON.stringify(this.products, null, 2), err => {
            if (err) {
                console.error('Error, no se pudo guardar los productos:', err);
            }
        });
    }

    getProducts() { //obtenemos los productos
        return this.products;
    }

    getProductById(id) { //teniendo el array, buscamos un producto por su id
        const producto = this.products.find(product => product.id === id); 

        if (producto) {
            return (`Producto con el ID ${producto.id} encontrado:`, producto);
        } 
        else {
            return (`Error, no se encontró un producto con el ID ${id}.`);
        }
    }

    updateProduct(id, updatedFields) { //actualiza la información del producto que coincida con el id
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            this.saveProducts();
        } else {
            console.log("Error, producto no encontrado para actualizar.");
        }
    }

    deleteProduct(id){ //eliminamos el producto con el id que coincida y actualizamos el array
        if (this.products.some(product => product.id === id)) {
            this.products = this.products.filter(product => product.id !== id);
            this.saveProducts();
        }
        else {
            console.log("Error, producto no encontrado para eliminar.");
        } 
    }
}

// ================== TESTEO ==================

// cd desafio2
// node ProductManager.js

// 1) Se crea una instancia de la clase 'ProductManager' con el parámetro del path
const manager = new ProductManager("./products.json"); 

// 2) Se llama al método 'getProducts', el cual devuelve un array vacío '[]'
console.log(manager.getProducts());

// 3) Se llama al método 'addProduct' para agregar productos al array. El ID debe autoincrementarse y no repetirse
manager.addProduct("Producto Prueba", "Este es un producto prueba.", 100, "Sin imagen", "code123",  50);
manager.addProduct("Hamburguesa",     "Completa y muy rica.",        200, "Sin imagen", "code456", 100);
manager.addProduct("Pancho",          "Con papitas y aderezos.",     50,  "Sin imagen", "code789",  25);
manager.addProduct("Producto Error",  "Este es un producto error.",  100, "Sin imagen", "code123",  50); // Tira error por tener el mismo 'code'

// 4) Se llama al método 'getProducts', el cual devuelve el array actualizado
console.log(manager.getProducts());

// 5) Se llama al método 'getProductById', el cual debe devolver el producto con el id especificado o arrojar error en caso de no existir
console.log(manager.getProductById(1));
console.log(manager.getProductById(4)); // Tira error por no encontrar un producto con ese ID

// 6) Se llama al método 'updateProduct', el cual nos permite cambiar/actualizar la información de un producto
manager.updateProduct(2, {
    title: "Producto 2 Actualizado",
    description: "Descripción del producto.",
    price: 100,
    thumbnail: "Con imagen",
    code: "code777",
    stock: 50
});
console.log(manager.getProducts());

// 7) Se llama al método 'deleteProduct', el cual debe eliminar un producto o arrojar error en caso de no existir
console.log(manager.deleteProduct(1));
console.log(manager.getProducts());
console.log(manager.deleteProduct(4)); // Tira error por no encontrar un producto con ese ID