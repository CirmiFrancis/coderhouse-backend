const socket = io(); 

const role = document.getElementById("userRole").textContent; // Desafío Complementario 3
const id = document.getElementById("userID").textContent; // Desafío Complementario 3
//console.log(role,id)

socket.on("productos", (data) => {
    //console.info(data);
    renderProductos(data);
})

const renderProductos = (productos) => { // función para renderizar los productos
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    
    productos.docs.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card", "card-modify", "mb-2", "p-5");

        if (item.owner === id) { // Desafío Complementario 3, para diferenciar de alguna forma tus productos de los demás
            card.innerHTML = ` 
                            <p class="fs-5 text-danger"> ${item.title} </p>
                            <p class="text-danger"> $ ${item.price} </p>
                            <button class="btn-modify"> Eliminar </button>
                            `;
        } 
        else {
            card.innerHTML = ` 
                            <p class="fs-5"> ${item.title} </p>
                            <p> $ ${item.price} </p>
                            <button class="btn-modify"> Eliminar </button>
                            `;
        }

        contenedorProductos.appendChild(card); // agrego la card dentro del contenedor

        card.querySelector("button").addEventListener("click", () => { // agregamos el evento al botón de eliminar
            if (role === "premium" && item.owner === id) {
                eliminarProducto(item._id);
            } 
            else if (role === "admin") {
                eliminarProducto(item._id);
            }
            else {
                Swal.fire({
                    toast: true,
                    position: "bottom-end",
                    timer: 2000,
                    title: "No tienes permisos para eliminar este producto.",
                    icon: "error",
                    showConfirmButton: false,
                    timerProgressBar: true
                });
            }
        })
    })
}

const eliminarProducto = (id) =>  { // enviamos al socket el evento para eliminar el producto junto al id
    socket.emit("eliminarProducto", id);
}

document.getElementById("btnEnviar").addEventListener("click", () => { // al hacer click en el botón del formulario, llamamos a la función para agregar un nuevo producto
    agregarProducto();
})

const agregarProducto = () => { // obtiene los datos del formulario y emite el evento junto con el producto
    //const role = document.getElementById("userRole").textContent;
    //const id = document.getElementById("userID").textContent;

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

    socket.emit("agregarProducto", producto);
}