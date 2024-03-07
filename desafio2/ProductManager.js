// ====== CÓDIGO ======

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

        const saveJson = async () => { //guardamos los productos en un JSON
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } 
        saveJson();
    }

    getProducts(){ //obtenemos los productos
        return this.products;
    }

    getProductById(id){
        //const producto = this.products.find(producto => producto.id === id);
        const producto = this.products.find(producto => producto.id === id); //teniendo el array, buscamos un producto por su id

        if (producto) {
            return (`Producto con el ID ${producto.id} encontrado:`, producto);
        } 
        else {
            return (`Error, no se encontró un producto con el ID ${id}.`);
        }
    }

    updateProduct(id, updatedProduct){ //método creado para actualizar el producto por id
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            //this.products[index] = { ...this.products[index], ...updatedProduct };
            this.products[index] = {...this.products[index], ...updatedProduct};

            const saveJson = async () => { //guardamos el nuevo array en el JSON
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
            } 
            saveJson();
        } else {
            return ("Error, producto no encontrado para actualizar.");
        }
    }

    async deleteProduct(id){ //método creado para eliminar un producto por id
        try {
            if (this.products.some(product => product.id === id)) {
                this.products = this.products.filter(product => product.id !== id);
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
            }
            else {
                console.error("Error, producto no encontrado para eliminar.");
            }
        }
        catch (error) {
            console.error(error.message);
        }
    }
}

// ====== TESTEO ======

// 1) Se crea una instancia de la clase 'ProductManager' con el parámetro del path
const manager = new ProductManager("./products.json"); 

// 2) Se llama al método 'getProducts', el cual devuelve un array vacío '[]'
console.log(manager.getProducts());

// 3) Se llama al método 'addProduct' para agregar productos al array. El ID debe autoincrementarse y no repetirse
manager.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc123", 25);
manager.addProduct("fideos", "los mas ricos", 200, "sin imagen", "abc124", 50);
manager.addProduct("arroz", "el que no se pasa", 300, "sin imagen", "abc124", 150); // Tira error por tener el mismo 'code'

// 4) Se llama al método 'getProducts', el cual devuelve el array actualizado
console.log(manager.getProducts());

// 5) Se llama al método 'getProductById', el cual debe devolver el producto con el id especificado o arrojar error en caso de no existir
console.log(manager.getProductById(1));
console.log(manager.getProductById(4)); // Tira error por no encontrar un producto con ese ID

// 6) Se llama al método 'updateProduct', el cual nos permite cambiar/actualizar la información de un producto
// manager.updateProduct(2, {
//     title: "Producto 2 Actualizado",
//     description: "Descripción",
//     price: 100,
//     thumbnail: "sin img",
//     code: "abc133",
//     stock: 20
// });
// console.log(manager.getProducts());

// 7) Se llama al método 'deleteProduct', el cual debe eliminar un producto o arrojar error en caso de no existir
console.log(manager.deleteProduct(1));
console.log(manager.getProducts());
console.log(manager.deleteProduct(4)); // Tira error por no encontrar un producto con ese ID

// node ProductManager.js