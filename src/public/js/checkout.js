document.addEventListener("DOMContentLoaded", () => {
    const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData')); // obtener los datos de sessionStorage

    if (checkoutData) { // verificar si hay datos en sessionStorage
        document.getElementById('cliente').textContent = checkoutData.data.cliente;
        document.getElementById('numTicket').textContent = checkoutData.data.numTicket;
        document.getElementById('email').textContent = checkoutData.data.email;
    } else {
        console.error('No se encontraron datos de la compra en sessionStorage.');
    }
});