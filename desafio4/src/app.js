const express = require("express");
const app = express(); 
const PUERTO = 8080;

const exphbs = require("express-handlebars");
const socket = require("socket.io");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

const io = socket(httpServer);

// Obtener productos
const ProductManager = require("./controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/products.json");

io.on("connection", async (socket) => {
    console.log("Un cliente conectado");

    socket.emit("products", await productManager.getProducts());

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        socket.emit("products", await productManager.getProducts());
    })

    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        socket.emit("products", await productManager.getProducts());
    })
})