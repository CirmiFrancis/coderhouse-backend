// Los DTOs (Data Transfer Object) son objetos que transportan datos, pero no suelen contener lógica de negocio.

class UserDTO { // este DTO transporta un nombre, un apellido y un rol
    constructor(firstName, lastName, role) {
        this.nombre = firstName;
        this.apellido = lastName;
        this.role = role;
    }
}

export default UserDTO;