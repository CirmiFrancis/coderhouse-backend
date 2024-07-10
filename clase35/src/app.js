//console.log(process.pid);

//USAREMOS EL MODULO NATIVO DE NODEJS CLUSTER 

import express from "express";
import cluster from "cluster";
import { cpus } from "os";
const numeroDeProcesadores = cpus().length;
//console.log(numeroDeProcesadores);

// Para visualizar los procesos que están escuchando y trabajando sobre el servidor:
//// tasklist /fi "imagename eq node.exe" (windows)
//// ps aux | grep node (mac)
//// ps aux | grep src/app.js (mac)

if (cluster.isPrimary) {
    //console.log("Proceso primario");

    for (let i = 0; i < numeroDeProcesadores; i++) {
        cluster.fork();
    }

} else {
    //console.log("Soy un proceso worker, y mi pid es el siguiente: " + process.pid);

    const app = express();

    // app.get("/", (req, res) => {
    //     res.send("Peticion atendida por un proceso worker")
    // })

    app.get("/operacionsimple", (req, res) => {
        let suma = 0; 
        for ( let i = 0; i < 1000000 ; i++ ) {
            suma += i;
        }
        res.send({suma}); 
    })

    app.get("/operacioncompleja", (req, res) => {
        let suma = 0;
        for ( let i = 0; i < 5e8 ; i++ ) {
            suma += i; 
        }
        res.send({suma});
    })

    app.listen( 8080, () => console.log("Escuchando en el puerto 8080"));

}

//Comando para Artillery: 
//artillery quick --count 40 --num 50 "http://localhost:8080/operacionsimple" -o simple.json
////artillery quick --count 40 --num 50 "http://localhost:8080/operacioncompleja" -o compleja.json