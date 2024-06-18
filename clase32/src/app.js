import express from "express";
const app = express();
const PUERTO = 8080;
import usuariosRouter from "./routes/usuarios.router.js";
import manejadorError from "./middleware/error.js";

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// 1) Importamos el modulo:
// import compression from "express-compression";
// 2) Lo usamos como middleware:

// GZIP
// app.use(compression);

// BROTLI (la compresion es mas efectiva pero, al usarlo como middleware, consume mas recursos)
// app.use(compression({
//     brotli: {
//         enabled: true, 
//         zlib: {} //zlib: es una dependencia interna de brotli que espera un objeto con diferentes niveles de compresion. 
//     }
// }));

// Ruta
// app.get("/", (req, res) => {
//     let string = "Hola coders, soy un string ridiculamente largo"; 
//     for ( let i = 0; i < 5e4; i++ ) {
//         string += "Hola coders, soy un string ridiculamente largo"; 
//     }
//     res.send(string);
// })

app.use("/usuarios", usuariosRouter);
app.use(manejadorError); // IMPORTANTE: el middleware debe ser invocado despues de las rutas

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

// sin compresión los datos transferidos son de 2.3mb
// con compresión GZIP los datos transferidos son de 7.1kb
// con compresión BROTLI los datos transferidos son de 364b