const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://franciscirmi:coderhouse@codercluster.u7pr2vc.mongodb.net/Clase26-Jugueteria?retryWrites=true&w=majority&appName=CoderCluster")
    .then( () => console.log("Conectado a la BD"))
    .catch( (error) => console.log(error))