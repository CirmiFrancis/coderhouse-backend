import express from "express";
const app = express();
const PUERTO = 8080; 

import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})