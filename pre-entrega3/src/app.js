// Imports
// const express = require("express");
// const app = express();
// const exphbs = require("express-handlebars");
// const cookieParser = require("cookie-parser");
// const passport = require("passport");
// const initializePassport = require("./config/passport.config.js");
// const cors = require("cors");
// const path = require('path');

import express from "express";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // ES6

const app = express();
const PUERTO = 8080;

// require("./database.js");

// const productsRouter = require("./routes/products.router.js");
// const cartsRouter = require("./routes/carts.router.js");
// const viewsRouter = require("./routes/views.router.js");
// const userRouter = require("./routes/user.router.js");

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

// Passport 
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

// AuthMiddleware
//const authMiddleware = require("./middleware/authmiddleware.js");
import authMiddleware from "./middleware/authmiddleware.js";
app.use(authMiddleware);

// UserMiddleware
import userMiddleware from "./middleware/usermiddleware.js";
app.use(userMiddleware);

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}.`);
});

// Websockets
//const SocketManager = require("./sockets/socketmanager.js");
import SocketManager from "./sockets/socketmanager.js";
new SocketManager(httpServer);