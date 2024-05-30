import { config } from "dotenv";
config();

const configObject = { // asignamos a variables los datos sensibles del archivo .env
    github_clientId: process.env.GITHUB_CLIENT_ID,
    github_clientSecret: process.env.GITHUB_CLIENT_SECRET,

    google_clientId: process.env.GOOGLE_CLIENT_ID,
    google_clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    puerto: process.env.PUERTO,
    mongo_url: process.env.MONGO_URL
}

export default configObject;