import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/user.router.js";
import sessionsRouter from "./routes/session.router.js";
import passport from "passport"; //clase21
import initializePassport from "./config/passport.config.js"; //clase21
import "./database.js";

const app = express(); 
const PUERTO = 8080; 

//Express-Handlebars: 
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars"); 
app.set("views", "./src/views");

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:"secretCoder",
    resave: true,
    saveUninitialized : true, 
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://franciscirmi:coderhouse@codercluster.u7pr2vc.mongodb.net/Clase19?retryWrites=true&w=majority", ttl: 100
    })
}))

//Cambios passport: 
app.use(passport.initialize()); //clase21
app.use(passport.session()); //clase21
initializePassport(); //clase21

//Rutas:
app.use("/", viewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);

app.listen(PUERTO, () => {
    console.log("Escuchando en el puerto 8080");
})