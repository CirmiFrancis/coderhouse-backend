import { Server } from "socket.io";
import ProductRepository from "../repositories/product.repository.js";
import MessageModel from "../models/message.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";

import EmailManager from "../services/email.js"
const emailManager = new EmailManager();

const productRepository = new ProductRepository();

class SocketManager { // administrador de sockets
    constructor(httpServer) {
        this.io = new Server(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() { // emite/escucha eventos
        this.io.on("connection", async (socket) => {
            console.http("Un cliente se conectó al chat comunitario.");
            
            socket.on("eliminarProducto", async (id) => { // escucha a realtime.js y manda mail al eliminar el producto
                const producto = await ProductModel.findById(id);
                const ownerId = producto.owner; 
                const user = await UserModel.findById(ownerId);
                const { title } = producto;
                const { role, email, first_name, last_name } = user;
                await productRepository.eliminarProducto(id);
                if (role === "premium") {
                    await emailManager.productoEliminado(email, first_name, last_name, title); // luego se manda el mail
                }
                socket.emit("productoEliminadoOAgregado"); // recarga página
            });

            socket.on("agregarProducto", async (producto) => { // escucha a realtime.js
                await productRepository.agregarProducto(producto);
                socket.emit("productoEliminadoOAgregado"); // recarga página
            });

            socket.on("message", async (data) => { // escucha a chat.js
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
        });
    }
}

export default SocketManager;