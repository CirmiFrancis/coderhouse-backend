import { config } from "dotenv";
config();

const configObject = { // asignamos a variables los datos sensibles del archivo .env
    puerto: process.env.PUERTO,
    mongo_url: process.env.MONGO_URL,

    github_clientId: process.env.GITHUB_CLIENT_ID,
    github_clientSecret: process.env.GITHUB_CLIENT_SECRET,

    google_clientId: process.env.GOOGLE_CLIENT_ID,
    google_clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    admin_email: process.env.ADMIN_EMAIL,
    admin_pass: process.env.ADMIN_PASS
}

export default configObject;