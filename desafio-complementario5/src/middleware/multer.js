import multer from "multer";

const storage = multer.diskStorage({ // middleware para almacenar los archivos, les asigna una carpeta destino y mantiene el nombre original del archivo
    destination: (req, file, cb) => { //
        let destinationFolder;
        switch(file.fieldname) {
            case "profile": 
                destinationFolder = "./src/uploads/profiles";
                break;
            case "products":
                destinationFolder = "./src/uploads/products";
                break;
            case "document":
                destinationFolder = "./src/uploads/documents"
        }
        cb(null, destinationFolder); // carpeta del archivo
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname); // nombre del archivo
    }
})

const upload = multer({storage: storage});
export const fields = upload.fields([
    { name: "document" }, 
    { name: "products" }, 
    { name: "profile" }
]);