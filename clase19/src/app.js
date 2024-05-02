import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
//import fileStore from "session-file-store";
import mongoStore from "connect-mongo";
//const fileStorage = fileStore(session);
const app = express(); 
const PUERTO = 8080;

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(session({
    //1) Creamos una sesion con Memory Storage: 
    secret: "secretCoder", 
    resave: true, 
    //Esta config me permite mantener la sesión activa frente a la inactividad del usuario. 
    saveUninitialized: true, 
    //Me permite guardar sesión aun cuando el objeto de sesión no tenga nada para contener. 

    //npm i session-file-store

    //2) Utilizando File Storage:
    ////store: new fileStorage({path:"./src/sessions", ttl: 15, retries: 1}),
    //path: la ruta de donde se van a guardar los archivitos de sesión. 
    //ttl: Time To Live (en segundos va!)
    //retries: cantidad de vecesque el servidor tratara de leer el archivo. 

    //Utilizamos Mongo Storage: 
    //instalamos: npm i connect-mongo
    store: mongoStore.create({
        mongoUrl: "mongodb+srv://franciscirmi:coderhouse@codercluster.u7pr2vc.mongodb.net/Clase19?retryWrites=true&w=majority", ttl:15
    })
}))
//Rutas

//Repaso de cookies:
app.get("/crearcuki", (req, res) => {
    res.cookie("cuki", "Esto es una cookie!").send("Cuki seteada!");
})
app.get("/borrarcuki", (req, res) => {
    res.clearCookie("cuki").send("Cuki borrada!");
})

//Login de usuario con Session: 
app.get("/login", (req, res) => {
    let usuario = req.query.usuario; 
    req.session.usuario = usuario;
    res.send("Guardamos el usuario por medio de query"); 
})
//Verificamos el usuario: 
app.get("/usuario", (req, res) => {
    if(req.session.usuario) {
        return res.send(`El usuario registrado es el siguiente: ${req.session.usuario}`);
    }
    res.send("No tenemos un usuario registrado, vamos a morir. ");
})

app.listen(PUERTO, () => {
    console.log("Escuchando en el puerto: " + PUERTO );
})