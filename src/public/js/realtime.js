const socket = io(); 

const eliminarProducto = async (id) => { // enviamos al socket el evento para eliminar el producto junto al id
    const clickeable = document.getElementsByClassName("clickeable");
    Array.from(clickeable).forEach(a => {
        a.classList.add("d-none");
    });
    socket.emit("eliminarProducto", id);
}

const agregarProducto = async (role, id) => { // obtiene los datos del formulario y emite el evento junto con el producto
    const owner = role === "premium" ? id : "admin"; // identifica el rol del dueño del producto
    let imageURL = document.getElementById("img").value; // imagen por defecto
    imageURL == "" ? imageURL = "img/no-image.jpg" : imageURL;
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: imageURL,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner
    };

    const clickeable = document.getElementsByClassName("clickeable"); // obtiene todos los trash y el botón enviar
    Array.from(clickeable).forEach(a => {
        a.classList.add("d-none"); // los vuelve invisible, para que no puedas interactuar con ellos
    });
    socket.emit("agregarProducto", producto);
}

socket.on("productoEliminadoOAgregado", () => {
    location.reload(); // recarga página
});