const socket = io(); 
const chatBox = document.getElementById("chatBox");
let user;

Swal.fire({ // sweet alert 2
    title: "Identificate", 
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat", 
    inputValidator: (value) => {
        return !value && "Por favor, escribe tu usuario."
    }, 
    allowOutsideClick: false, // no puedo clickear fuera
    allowEscapeKey: false // no puedo apretar escape
}).then( result => {
    user = result.value.toUpperCase();
})

chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) { // si el mensaje tiene más de 0 caracteres, lo enviamos al servidor
            socket.emit("message", {user: user, message: chatBox.value}); 
            chatBox.value = "";
        }
    }
})

socket.on("message", data => { // listener de mensajes
    let log = document.getElementById("messagesLogs");
    let messages = "";

    data.forEach( message => {
        messages = messages + `<u>${message.user}</u>: ${message.message} <br>`
    })

    log.innerHTML = messages;
})