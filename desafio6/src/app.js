import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
//import { Server as SocketIOServer } from 'socket.io';

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/user.router.js";
import sessionsRouter from "./routes/session.router.js";

import "./database.js";

const app = express();
const PUERTO = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true})); 
app.use(express.static("./src/public"));
app.use(session({
    secret:"secretCoder",
    resave: true,
    saveUninitialized : true, 
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://franciscirmi:coderhouse@codercluster.u7pr2vc.mongodb.net/DesafioComplementario1?retryWrites=true&w=majority", ttl: 100
    })
}));
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

// Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas 
app.use("/", viewsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

// Chat
// import MessageModel from "./models/messages.model.js";
// const io = new SocketIOServer(httpServer);

// io.on("connection",  (socket) => {
//     console.log("Nuevo usuario conectado.");
    
//     socket.on("message", async data => {
//         await MessageModel.create(data);
//         const messages = await MessageModel.find();
//         console.log(messages);
//         io.sockets.emit("message", messages);
//     })
// })