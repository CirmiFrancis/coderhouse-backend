//FAKER-js: 
//Instalamos: npm install @faker-js/faker

import express from "express"; 
import usuariosRouter from "./routes/usuarios.router.js"; 
const app = express(); 
const PUERTO = 8080; 

app.use("/", usuariosRouter); 

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto de Mar del Plata`);
})