import mongoose from "mongoose";

mongoose.connect("mongodb+srv://franciscirmi:coderhouse@codercluster.u7pr2vc.mongodb.net/ProyectoFinal?retryWrites=true&w=majority&appName=CoderCluster")
    .then(() => console.log("Conectado a la base de datos de MongoDB."))
    .catch(() => console.log("Hay un error en la conexión.", error))