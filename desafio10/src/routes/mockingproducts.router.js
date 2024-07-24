import express from "express";
import { generar100Productos } from "../utils/mockingproducts.js";
const router = express.Router(); 

router.get("/mockingproducts", (req, res) => {
    const productos = []; 

    for (let i = 1; i <= 100; i++) {
        productos.push(generar100Productos()); 
    }

    res.send(productos);
})

export default router;