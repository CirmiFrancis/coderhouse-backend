import mongoose from "mongoose";

mongoose.connect("mongodb+srv://franciscirmi:coderhouse@codercluster.u7pr2vc.mongodb.net/Clase24-JWT?retryWrites=true&w=majority&appName=CoderCluster")
    .then( () => console.log("Conectado a la Base de Datos."))
    .catch( (error) => console.log("Hay un problema: ", error))