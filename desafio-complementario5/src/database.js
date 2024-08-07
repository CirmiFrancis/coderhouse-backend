import mongoose from "mongoose";
import dotenv from 'dotenv'; // .env

dotenv.config(); // .env

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL)
    .then(() => console.info("Conectado a la base de datos de MongoDB."))
    .catch((error) => console.error("Hay un error en la conexión.", error))