export const generateUniqueCode = () => { // función para generar un código único para el ticket
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 8;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    const timestamp = Date.now().toString(36);
    return code + '-' + timestamp;
}

export const calcularTotal = (products) => { // función para calcular el total de la compra
    let total = 0;

    products.forEach(item => {
        total += item.product.price * item.quantity;
    });

    return total;
}