const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://franciscirmi:coderhouse@codercluster.u7pr2vc.mongodb.net/ProyectoFinal?retryWrites=true&w=majority&appName=CoderCluster")
    .then(() => console.log("Conexión exitosa"))
    .catch(() => console.log("Vamos a morir, tenemos un error"))
    