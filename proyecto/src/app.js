// App --> Router --> Controller --> Repository --> Model

// Imports
import { fileURLToPath } from "url"; // ES6
import compression from "express-compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';
import express from "express";
import exphbs from "express-handlebars";
import handlebars from 'handlebars';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import passport from "passport";
import path from "path";

import addLogger from "./utils/logger.js";
import authMiddleware from "./middleware/authmiddleware.js";
import initializePassport from "./config/passport.config.js";
import manejadorError from "./middleware/error.js";
import mockingProductsRouter from "./routes/mockingproducts.router.js";
import socketManager from "./sockets/socketmanager.js";
import userMiddleware from "./middleware/usermiddleware.js";

import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import userRouter from "./routes/user.router.js";
import viewsRouter from "./routes/views.router.js";

import "./database.js";

dotenv.config();

const app = express();
const PUERTO = process.env.PORT;

// Obtener el directorio actual del archivo (ES6)
const __filename = fileURLToPath(import.meta.url); // se escribe con __ por convención, indica que son variables especiales
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static("./src/public")); // esta forma asigna una ruta específica, por lo que es relativo a la carpeta actual
app.use(express.static(path.join(__dirname, 'public'))); // esta forma permite detectar la ruta desde cualquier carpeta
app.use(cors());
app.use(addLogger); // logger

// Passport 
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

// AuthMiddleware
app.use(authMiddleware);

// UserMiddleware
app.use(userMiddleware);

// BROTLI (compresión de los datos transferidos)
app.use(compression({
    brotli: {
        enabled: true, 
        zlib: {}
    }
}));

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Helpers
handlebars.registerHelper('ifNotEqual', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

// Mock de 100 productos
app.use("/", mockingProductsRouter);

// Manejador de errores (después de las rutas)
app.use(manejadorError);

// Swagger
const swaggerOptions = { // objeto de configuración
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de Peticiones HTTP",
            description: "Implementado en el desafío 10 del curso."
        }
    },
    apis: ["./src/docs/**/*.yaml"]
}

const specs = swaggerJSDoc(swaggerOptions); // lo conectamos a express
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Servidor
const httpServer = app.listen(PUERTO, () => {
    console.info(`Servidor escuchando en el puerto ${PUERTO}.`);
});

// Websockets
new socketManager(httpServer);