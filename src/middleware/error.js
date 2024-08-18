import { EErrors } from "../services/errors/enum.js";

const manejadorError = (error, req, res, next) => { // middleware usada para manejar errores
    console.error(error.causa); 
    switch(error.code) {
        case EErrors.TIPO_INVALIDO: 
            res.status(400).send({status: "error", error: error.message})
            break; 
        default: 
            console.error('Error detallado:', error);
            res.status(500).send({status: "error", error: "Error desconocido."});
    }
}

export default manejadorError;