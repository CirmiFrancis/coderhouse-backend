const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
})

// Renderizar el listado de productos
const renderProducts = (products) => {
    const containerProducts = document.getElementById("containerProducts");
    containerProducts.innerHTML = "";

    products.forEach(item => {
        const card = document.createElement("div");
        card.innerHTML = `
                            <p class="fs-4 mx-5"> ID: ${item.id} </p>
                            <p class="fs-4 mx-5"> Titulo:  ${item.title} </p>
                            <p class="fs-4 mx-5"> Precio: ${item.price} </p>
                            <button class="mb-5 mx-5"> Eliminar producto </button>
                        `;
        containerProducts.appendChild(card);
    
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id)
        }) 
    })
}

// Eliminar un producto
const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}

// Agregar un producto
document.getElementById("sendBtn").addEventListener("click", () => {
    addProduct();
})

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    };
    socket.emit("addProduct", product);
}