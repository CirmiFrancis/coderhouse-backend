// Instalamos: npm i express y npm i nodemon -D

import express from "express";
import nodemailer from "nodemailer";
import exphbs from "express-handlebars";
const app = express();
const PUERTO = 8080;

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Express-Handlebars: 
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas 
app.get("/mail", async (req, res) => {
    try {
        await transport.sendMail({
            from: "Coder Test <franciscirmi@gmail.com>",
            to: "cirmifrancis@gmail.com",
            subject: "Correo de Prueba",
            html: `<h1> Hola, hoy es día de magos </h1>
                    <img src="cid:mago">`,
            
            // Para enviar una imagen como adjunto: 
            attachments: [{
                filename: "mago.jpeg",
                path: "./src/public/img/mago.jpeg",
                cid: "mago"
            }]
        })
        res.send("Correo enviado correctamente");
    } catch (error) {
        res.status(500).send("Error al enviar un email, nos vamos a morir");
    }
})

// Mostramos la vista contacto: 
app.get("/contacto", (req, res) => {
    res.render("contacto");
})

app.post("/enviarmensaje", async (req, res) => {
    const { email, titulo, mensaje } = req.body;
    try {
        await transport.sendMail({
            from: "Coder Mail <franciscirmi@gmail.com>",
            to: email,
            subject: titulo,
            text: mensaje
        })
        res.send("Correo enviado! Todo nos sale bien");
    } catch (error) {
        res.status(500).send("Todo mal, a llorar al campito");
    }
})

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

//1) Instalamos: npm i nodemailer
//2) Importamos el modulo: import nodemailer from "nodemailer"
//3) Vamos a crear un objeto especial llamado "transporte". Acá voy a configurar el servicio SMTP que vamos a utilizar

// Nodemailer (falta la contraseña de aplicaciones):
const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "franciscirmi@gmail.com",
        pass: "mi-contrasena-de-aplicaciones" // Acá va la contraseña de aplicaciones de gmail
    }
})

// TWILIO (falta id, token, nro que envia, nro que recibe):
const TWILIO_ACCOUNT_SID = "aaa"; // Acá va el id
const TWILIO_AUTH_TOKEN = "bbb"; // Acá va el token
const TWILIO_SMS_NUMBER = "ccc"; // Acá va el nro de telefóno que va a enviar los SMS

// Instalamos: npm i twilio

// Importamos: 
import twilio from "twilio";

// Configuramos el Cliente: 
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_NUMBER);

// Creamos una ruta para enviar un SMS: 
app.get("/sms", async (req, res) => {
    try {
        await client.messages.create({
            body: "Su auto ya esta limpio, puede venir a retirarlo.",
            from: TWILIO_SMS_NUMBER,
            to: "1234" // Acá va el nro de telefóno que va a recibir los SMS
        })
        res.send("Enviado el SMS!");
    } catch (error) {
        res.status(500).send("Error al enviar el SMS");
    }
})