import mongoose from "mongoose";

mongoose.connect("mongodb+srv://franciscirmi:coderhouse@codercluster.u7pr2vc.mongodb.net/DesafioComplementario1?retryWrites=true&w=majority&appName=CoderCluster")
    .then( () => console.log("Conectado a la base de datos de MongoDB."))
    .catch( (error) => console.log("Hay un error en la conexión.", error))

// Utilizo la collection 'DesafioComplementario1' ya que sigo trabajando con esos documentos. Para la próxima, debería de haber guardado la colección con otro nombre.