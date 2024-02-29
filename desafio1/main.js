// ====== CÓDIGO ======

class ProductManager {
    static ultId = 0; // al estar declarada como 'static', la variable 'ultId' será compartida por todas las instancias de la clase, en lugar de tener una copia separada para cada instancia
    constructor() {
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock) {
    
        if(!title || !description || !price || !thumbnail || !code || !stock) {
            return console.log("Por favor, completa todos los campos.");
        }
    
        if(this.products.some(item => item.code === code)) {
            return console.log(`El código ${code} ya está asignado a un producto. Por favor, ingrese otro código.`);
        }
        
        const newProduct = {
            id: ++ProductManager.ultId, // el ++ puede ir antes o despues como en 'ProductManager.ultId++', la diferencia está en que el primero realiza el incremento y luego la asignación (id:0 -> id:1 | id:1 -> id:2), mientras que el segundo realiza primero la asignación y luego el incremento (id:0 -> id:0 | id:1 -> id:1). En este caso, 'ultId = 0' pero primero se incrementa a '1' y luego se lo asigna, por lo que el primer producto arranca con 'ultId = 1'
            title,
            description,
            price, 
            thumbnail,
            code,
            stock
        }

        this.products.push(newProduct);
    }

    getProducts(){
        return this.products;
    }

    getProductById(id){
        const producto = this.products.find(producto => producto.id === id);

        if (producto) {
            return console.log (`Producto con el ID ${producto.id} encontrado:`, producto);
        } 
        else {
            return console.log (`No se encontró un producto con el ID ${id}.`);
        }
    }
}

// ====== TESTEO ======

// 1) Se crea una instancia de la clase 'ProductManager'
const manager = new ProductManager(); 

// 2) Se llama a 'getProducts', el cual devuelve un array vacío '[]'
console.log(manager.getProducts());

// 3) Se llama a 'addProduct' para agregar productos al array. El ID debe autoincrementarse y no repetirse
manager.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc123", 25);
manager.addProduct("fideos", "los mas ricos", 200, "sin imagen", "abc124", 50);
manager.addProduct("arroz", "el que no se pasa", 300, "sin imagen", "abc124", 150); // Tira error por tener el mismo 'code'

// 4) Se llama a 'getProducts' nuevamente, el cual, a diferencia de antes, ahora devuelve un array con dos productos
console.log(manager.getProducts());

// 5) Se evalúa que 'getProductById' funcione correctamente, devolviendo 'error' en caso de no encontrar el producto por el ID, o devolviendo el producto en sí, en caso de encontrarlo
manager.getProductById(2);
manager.getProductById(3);