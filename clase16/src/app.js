/** CLASE 16 - MONGO AVANZADO 1  **/

//Temas de hoy: 

//1) Teoria de la indexacion. 
//2) Manejo de Populations en MongoDB
//3) PRE

////////////////////////////////////////////////////////////////////

//Index: 
//La indexacion es una técnica o proceso que realizamos para tener una respuesta a la consultas mucho mas rapido. 

//Nos permitirá tener una referencia previa al momento de buscar un documento, con el fin de evitar recorrer toda la colección, documento por documento, hasta encontrar dicho valor. 

//Esta referencia es la que se conoce como indice y se crea a partir de uno o varios campos del documento. 

import mongoose from "mongoose";
import UserModel from "./models/usuario.js";

const main = async () => {
    await mongoose.connect("mongodb+srv://franciscirmi:coderhouse@codercluster.u7pr2vc.mongodb.net/Coder?retryWrites=true&w=majority&appName=CoderCluster");

    const respuesta = await UserModel.find({edad: {$lt:19}}).explain("executionStats");
    //El metodo explain me da una estadistica de la consulta y le paso el parametro "executionStats" para obtener todos los detalles. 
    console.log(respuesta);

}

//main();

//Datos obtenidos: 

//Resultados por consulta "Carlos"
//nReturned: 111
//ExecutionTimeMillis: 94

//Peeeero aplicando index: 
//ExecutionTimeMillis: 3

//Si busco menores de 19 años: 
//nReturned: 384
//ExecutionTimeMillis: 31

//Peeeeeero aplicando el index: 
//ExecutionTimeMillis: 1

//EJERCICIO CON CURSOS Y ALUMNOS APLICANDO POPULATIONS
import AlumnoModel from "./models/alumno.js";
import CursoModel from "./models/curso.js";

const principal = async () => {
    await mongoose.connect("mongodb+srv://franciscirmi:coderhouse@codercluster.u7pr2vc.mongodb.net/Coder?retryWrites=true&w=majority&appName=CoderCluster");

    //const estudiantePedro = await AlumnoModel.findById("662689bc6b3478e4e3fcfdef");
    //console.log(estudiantePedro);

    //Buscamos el curso de Backend: 
    //const cursoBackend = await CursoModel.findById("662689c16b3478e4e3fcfdf4");
    //console.log(cursoBackend);

    //Ahora ingreso el curso al alumno: 
    //estudiantePedro.cursos.push(cursoBackend);

    //Actualizo el documento: 
    //await AlumnoModel.findByIdAndUpdate("662689bc6b3478e4e3fcfdef", estudiantePedro);

    const estudiantesCompletos = await AlumnoModel.findById("662689bc6b3478e4e3fcfdef")
    //.populate("cursos");
    console.log(estudiantesCompletos);
}

principal();