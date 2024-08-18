import winston from "winston";
import dotenv from 'dotenv'; // .env

dotenv.config(); // .env

const LOGGER_ENV = process.env.LOGGER_ENV;; // produccion o desarrollo

// Personalización de niveles: 
const niveles = {
    nivel: {
        fatal: 0,
        error: 1,
        warning: 2, 
        info: 3, 
        http: 4, 
        debug: 5
        // silly: 6 (podría agregarse)
    }, 
    colores: {
        fatal: "red", 
        error: "yellow",
        warning: "blue", 
        info: "green", 
        http: "magenta", 
        debug: "white"
    }
}

// Loggers
const loggerDesarrollo = winston.createLogger({ // logger para desarrollo
    levels: niveles.nivel,
    transports: [
        new winston.transports.Console({
            level: "debug", // muestra todos los mensajes a partir del nivel "debug" y superior
            format: winston.format.combine(
                winston.format.colorize({colors: niveles.colores}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./errors.log", 
            level: "error", // registra solo los mensajes de nivel "error" en el archivo errors.log
            format: winston.format.simple()
        })
    ]
})

const loggerProduccion = winston.createLogger({ // logger para produccion
    levels: niveles.nivel,
    transports: [
        new winston.transports.Console({
            level: "info", // muestra todos los mensajes a partir del nivel "info" y superior
            format: winston.format.combine(
                winston.format.colorize({colors: niveles.colores}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./errors.log", 
            level: "error", // registra solo los mensajes de nivel "error" en el archivo errors.log
            format: winston.format.simple()
        })
    ]
})

// Funciones sobreescritas para que funcionen los logger
console.fatal = function(){
    return logger.fatal.apply(logger, arguments)
}
console.error = function(){
    return logger.error.apply(logger, arguments)
}
console.warning = function(){
    return logger.warning.apply(logger, arguments)
}
console.info = function(){
    return logger.info.apply(logger, arguments)
}
console.http = function(){
    return logger.http.apply(logger, arguments)
}
console.debug = function(){
    return logger.debug.apply(logger, arguments)
}

// Determinar que logger usar de acuerdo a la variable de entorno (.env)
const logger = LOGGER_ENV === "produccion" ? loggerProduccion : loggerDesarrollo; 

// Middleware: 
const addLogger = (req, res, next) => {
    req.logger = logger; 
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}

export default addLogger;