import mongoose from "mongoose";

import configObject from "./config/config.js";
const { mongo_url } = configObject;

mongoose.connect(mongo_url)
    .then( () => console.log("Conectado a la base de datos de MongoDB."))
    .catch( (error) => console.log("Hay un error en la conexión.", error))

// Utilizo la collection 'DesafioComplementario1' ya que sigo trabajando con esos documentos.