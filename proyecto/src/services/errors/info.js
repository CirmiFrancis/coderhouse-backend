const generarInfoError = (producto) => { // mensaje personalizado para indicar un error al crear un producto
    return `\nLos datos están incompletos o no son válidos. Se necesita recibir los siguientes datos:
    - Title: se esperaba un String. Se recibió: ${producto.title}
    - Description: se esperaba un String. Se recibió: ${producto.description}
    - Price: se esperaba un Number. Se recibió: ${producto.price}
    - Code: se esperaba un String. Se recibió: ${producto.code}
    - Stock: se esperaba un Number. Se recibió: ${producto.stock}
    - Category: se esperaba un String. Se recibió: ${producto.category}
    `
}

export default generarInfoError;