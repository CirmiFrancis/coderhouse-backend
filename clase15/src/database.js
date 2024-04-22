import mongoose from "mongoose";

mongoose.connect("mongodb+srv://franciscirmi:coderhouse@codercluster.u7pr2vc.mongodb.net/Coderest?retryWrites=true&w=majority&appName=CoderCluster")
    .then( () => console.log("Conectado a MONGODB."))
    .catch( (error) => console.log("Hay un error.", error))