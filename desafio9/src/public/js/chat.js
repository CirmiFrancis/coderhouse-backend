const socket = io(); 
let user; 
const chatBox = document.getElementById("chatBox");

//Sweet Alert 2
Swal.fire({
    title: "Identificate", 
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat", 
    inputValidator: (value) => {
        return !value && "Por favor, escribe tu usuario."
    }, 
    allowOutsideClick: false,
}).then( result => {
    user = result.value.toUpperCase();
})

chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        //Si el mensaje tiene más de 0 caracteres, lo enviamos al servidor.
        if(chatBox.value.trim().length > 0) {
            socket.emit("message", {user: user, message: chatBox.value}); 
            chatBox.value = "";
        }
    }
})

//Listener de Mensajes: 
socket.on("message", data => {
    let log = document.getElementById("messagesLogs");
    let messages = "";

    data.forEach( message => {
        messages = messages + `<u>${message.user}</u>: ${message.message} <br>`
    })

    log.innerHTML = messages;
})