import express from "express";
const app = express(); 
import exphbs from "express-handlebars";
import { Server as SocketIOServer } from 'socket.io';
const PUERTO = 8080;
import "./database.js";

// Rutas
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true})); 
app.use(express.static("./src/public"));

// Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

// Chat
import MessageModel from "./models/messages.model.js";
const io = new SocketIOServer(httpServer);

io.on("connection",  (socket) => {
    console.log("Nuevo usuario conectado");
    
    socket.on("message", async data => {
        await MessageModel.create(data);
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
    })
})