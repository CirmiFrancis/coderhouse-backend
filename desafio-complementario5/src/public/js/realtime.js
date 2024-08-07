const socket = io(); 

const role = document.getElementById("userRole").textContent; // Desafío Complementario 3
const id = document.getElementById("userID").textContent; // Desafío Complementario 3
//console.log(role,id)

socket.on("productos", (data) => {
    //console.info(data);
    renderProductos(data);
})

//Función para renderizar nuestros productos: 
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    
    productos.docs.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card", "p-2", "mb-2", "p-5");

        if (item.owner === id) { // // Desafío Complementario 3, para diferenciar de alguna forma tus productos de los demás
            card.innerHTML = ` 
                            <p class="fs-5 text-danger"> ${item.title} </p>
                            <p class="text-danger"> $ ${item.price} </p>
                            <button> Eliminar </button>
                            `;
        } 
        else {
            card.innerHTML = ` 
                            <p class="fs-5"> ${item.title} </p>
                            <p> $ ${item.price} </p>
                            <button> Eliminar </button>
                            `;
        }

        contenedorProductos.appendChild(card);
        //Agregamos el evento al boton de eliminar: 
        card.querySelector("button").addEventListener("click", ()=> {
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

const eliminarProducto = (id) =>  {
    socket.emit("eliminarProducto", id);
}

//Agregamos productos del formulario: 
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
})

const agregarProducto = () => {

    //const role = document.getElementById("userRole").textContent;
    //const id = document.getElementById("userID").textContent;

    const owner = role === "premium" ? id : "admin";

    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner
    };

    socket.emit("agregarProducto", producto);
}