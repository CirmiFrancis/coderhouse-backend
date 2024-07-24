class CustomError {
    static crearError({nombre = "Error", causa = "Desconocido", mensaje, codigo = 1}) {
        const error = new Error(mensaje); 
        error.name = nombre; 
        error.causa = causa;
        error.code = codigo; 
        throw error; 
        // Esto detiene la ejecución de la app, por eso tenemos que capturarlo (del otro lado debe de haber un try-catch)
    }
}

export default CustomError;