import winston from "winston";

// Pueden traer del configObject: node_env
// const { node_env } = configObject; 
const node_env = "desarrollo"; // produccion o desarrollo

// Personalizar nuestros niveles: 
const niveles = {
    nivel: {
        fatal: 0,
        error: 1,
        warning: 2, 
        info: 3, 
        http: 4, 
        debug: 5
        // silly: 6, pero no lo pide el desafío
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

const loggerDesarrollo = winston.createLogger({
    levels: niveles.nivel,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors: niveles.colores}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./errors.log", 
            level: "error",
            format: winston.format.simple()
        })
    ]
})

const loggerProduccion = winston.createLogger({
    levels: niveles.nivel,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors: niveles.colores}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./errors.log", 
            level: "error",
            format: winston.format.simple()
        })
    ]
})

// Sobreescribir console.log y demás para usar el logger
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
const logger = node_env === "produccion" ? loggerProduccion : loggerDesarrollo; 

// Middleware: 
const addLogger = (req, res, next) => {
    req.logger = logger; 
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}

export default addLogger;