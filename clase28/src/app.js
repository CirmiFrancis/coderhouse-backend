import express from "express";
import contactRouter from "./routes/contacts.router.js";
import { options } from "./config/config.js";
// import { connectDB } from "./config/dbConnection.js";

const PORT = options.server.port;
const app = express();

app.use(express.json());

app.use("/api/contacts", contactRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});