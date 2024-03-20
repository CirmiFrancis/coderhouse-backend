/** CLASE 9 - MOTORES DE PLANTILLAS **/

//Temas de hoy: 

//¿Que es un motor de plantillas?
// Handlebars, instalacion y uso. 
// Estructuras, condicionales y ciclos. 
// Organizamos el router de handlebars
// Trabajamos con la carpeta public, con js y css. 

//Preparamos nuestro proyecto: 
//npm init --yes
//npm i nodemon -D
//npm i express 

//Instalamos: npm i express-handlebars

// Handlebars, es una biblioteca de JavaScript que facilita la implementación de HTML, en otras palabras, es un motor de plantillas para aplicaciones web. Es una alternativa a otras similares como 'EJS' o 'Pug'. Es útil para páginas estáticas como landing page, pero para páginas más dińamicas es preferible usar 'React' por ejemplo. (DESACTUALIZADO)

// Express-handlebars, es una dependencia creada para express. (ACTUALIZADO)

//Organizamos nuestra app: 

const express = require("express");
//import express from "express";
const app = express();
const PUERTO = 8080;

const viewsRouter = require("./routes/views.router.js");
//import viewsRouter from "./routes/views.router.js";

//Middleware
app.use(express.static("./src/public"));

//Me traigo el módulo de Express-Handlebars
const exphbs = require("express-handlebars");
//import exphbs from "express-handlebars";

//Configuramos el motor de plantillas:
app.engine("handlebars", exphbs.engine());
//Le decimos a express que cuando vea un archivo de extensión "handlebars" utilice el motor de plantillas: "handlebars".

app.set("view engine", "handlebars"); 
//Nuevamente le decimos que la vista de nuestra aplicación es desarrollada con Handlebars. 

app.set("views", "./src/views");
//Acá le decimos donde tiene que ir a buscar los archivos "handlebars"

app.use("/", viewsRouter);

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})