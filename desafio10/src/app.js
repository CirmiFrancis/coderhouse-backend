// App --> Router --> Controller --> Repository --> Model

// Imports
import express from "express";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // ES6
import addLogger from "./utils/logger.js";
import dotenv from 'dotenv'; // .env
import Handlebars from 'handlebars';

dotenv.config(); // .env

const app = express();
const PUERTO = process.env.PORT;

import "./database.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import userRouter from "./routes/user.router.js";

// Obtener el directorio actual del archivo (ES6)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static("./src/public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(addLogger); // logger

// Passport 
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

// AuthMiddleware
import authMiddleware from "./middleware/authmiddleware.js";
app.use(authMiddleware);

// UserMiddleware
import userMiddleware from "./middleware/usermiddleware.js";
app.use(userMiddleware);

// BROTLI (compresión de los datos transferidos)
import compression from "express-compression";
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
Handlebars.registerHelper('ifNotEqual', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

// Mock de 100 productos
import mockingProductsRouter from "./routes/mockingproducts.router.js";
app.use("/", mockingProductsRouter);

// Manejador de errores (después de las rutas)
import manejadorError from "./middleware/error.js";
app.use(manejadorError);

// Swagger
import swaggerJSDoc from 'swagger-jsdoc'; // swagger
import swaggerUiExpress from 'swagger-ui-express'; // swagger

const swaggerOptions = { // objecto de configuración
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación del Desafio 10",
            description: "Descripción de la documentación del desafío 10."
        }
    },
    apis: ["./src/docs/**/*.yaml"]
}

const specs = swaggerJSDoc(swaggerOptions); // lo conectamos a Express
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Servidor
const httpServer = app.listen(PUERTO, () => {
    console.info(`Servidor escuchando en el puerto ${PUERTO}.`);
});

// Websockets
import SocketManager from "./sockets/socketmanager.js";
new SocketManager(httpServer);