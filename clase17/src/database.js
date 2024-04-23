import mongoose from "mongoose";

mongoose.connect("mongodb+srv://franciscirmi:coderhouse@codercluster.u7pr2vc.mongodb.net/Clase17?retryWrites=true&w=majority&appName=CoderCluster")
    .then(() => console.log("Todo perfecto, la vida es bella"))
    .catch((error) => console.log("No flaco, no funciona, ta todo mal: ", error) )