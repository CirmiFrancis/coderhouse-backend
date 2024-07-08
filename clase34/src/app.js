import express from "express";
const app = express(); 
const PUERTO = 8080;
import addLogger from "./utils/logger.js";

//Middleware: 
app.use(addLogger);

//RUTA PARA TESTEAR WINSTON: 
app.get("/loggertest", (req, res) => {
    req.logger.http("Mensaje HTTP"); 
    req.logger.info("Mensaje INFO"); 
    req.logger.warning("Mensaje WARNING"); 
    req.logger.error("Mensaje ERROR"); 

    res.send("Logs generados");
})

//Rutas: 
app.get("/", (req, res) => {
    res.send("Olis, que hacen? ");
})

//Simulamos algunas peticiones: 

//OPERACION SIMPLE: 
app.get("/operacionsimple", (req, res) => {
    let suma = 0; 

    for ( let i = 0; i < 1000000; i++ ) {
        suma += i;
    }

    res.send({suma}); 
})

//OPERACION COMPLEJA: 
app.get("/operacioncompleja", (req, res) => {
    let suma = 0; 

    for ( let i = 0; i < 5e8; i++ ) {
        suma += i;
    }

    res.send({suma}); 
})

// En la terminal (se genera el archivo simple.json y compleja.json):
//artillery quick --count 40 --num 50 "http://localhost:8080/operacionsimple" -o simple.json
//artillery quick --count 40 --num 50 "http://localhost:8080/operacioncompleja" -o compleja.json

app.listen(PUERTO, () => {
    console.log(`Si no contesto mas llamen a los bomberos`);
})