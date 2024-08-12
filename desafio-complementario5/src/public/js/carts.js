function eliminarProducto(cartId, productId) { // elimina un producto del carrito
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el producto del carrito.');
            }
            location.reload(); // recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function vaciarCarrito(cartId) { // vacia el carrito
    fetch(`/api/carts/${cartId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al vaciar el carrito.');
            }
            location.reload(); // recarga la página
        })
        .catch(error => {
            console.error('Error:', error);
        });
}