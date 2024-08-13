function sendPutRequest(url) { // petición PUT para cambiar rol
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    }).then(response => {
        if (response.ok) {
            console.log('Rol de usuario actualizado.');
            location.reload();
        } else {
            Swal.fire({
                toast: true,
                position: "bottom-end",
                timer: 2000,
                title: "El usuario no posee los documentos requeridos.",
                icon: "error",
                showConfirmButton: false,
                timerProgressBar: true
            });
            console.error('Error. Rol de usuario no actualizado:', response.status);
            return response.text().then(text => {
                console.error('Motivo:', text);
            });
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}

function sendDeleteRequest(url) { // petición DELETE para eliminar usuario
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.ok) {
            console.log('Usuario eliminado correctamente.');
            location.reload();
        } else {
            Swal.fire({
                toast: true,
                position: "bottom-end",
                timer: 2000,
                title: "El usuario no puedo eliminarse.",
                icon: "error",
                showConfirmButton: false,
                timerProgressBar: true
            });
            console.error('Error. Usuario no eliminado:', response.status);
            return response.text().then(text => {
                console.error('Motivo:', text);
            });
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}