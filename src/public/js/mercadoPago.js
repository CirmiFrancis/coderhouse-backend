// MercadoPago - Lado Cliente
const mp = new MercadoPago("APP_USR-ed04fe76-0210-4f0b-a690-16c37a51945d", {
    locale:"es-AR"
}); 

document.getElementById("checkout-btn").addEventListener("click",  async (event) => {
    event.preventDefault();

    try {
        const cartID = window.location.pathname.replace('/carts/', '');
        //console.log(cartID);
        const cartResponse = await fetch(`http://localhost:8080/api/carts/${cartID}`);
        const cart = await cartResponse.json();
        const orderData = cart.products.map(item => ({ // productos en el carrito
            title: item.product.title,
            quantity: item.quantity,
            price: item.product.price,
        }));
        //console.log(orderData);
        const response = await fetch("http://localhost:8080/create-preference", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({ // datos de la orden y el carrito
                items: orderData,
                cartId: cartID
            })
        });
        const preference = await response.json(); 
        createCheckoutButton(preference.id); 
    } catch (error) {
        console.error('Error al generar la preferencia:', error);   
    }
})

const createCheckoutButton = (preferenceId) => { // crea el botón de pago
    const bricksBuilder = mp.bricks();
    const renderComponent = async () => {
        if (!window.checkoutButton) { // evita que se dupliquen los botones
            window.checkoutButton = await bricksBuilder.create("wallet", "wallet_container", {
                initialization: {
                    preferenceId: preferenceId
                }
            });
        }
    }
    renderComponent();
}