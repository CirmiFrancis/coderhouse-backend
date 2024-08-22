document.addEventListener("DOMContentLoaded", async () => {
    try {
        const cid = window.location.pathname.split('/')[2]; // obtener el CID de la URL actual
        //console.log(cid);
        const response = await fetch(`/api/carts/${cid}/purchase`, {
            method: 'POST', // Método POST
            headers: {
                'Content-Type': 'application/json',
            },
        });
        //console.log(response);

        const data = await response.json();
        if (response.ok) {
            //console.log('Compra finalizada', data);
            sessionStorage.setItem('checkoutData', JSON.stringify(data));
            window.location.href = "/checkout"; // redirige a la página de éxito 
        } else {
            console.error('Error en la compra:', data.error);
            window.location.href = "/error"; // redirige a una página de error
        }
    } catch (error) {
        console.error('Error al finalizar la compra', error);
        window.location.href = "/error";
    }
});