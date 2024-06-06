import express from "express";
import cors from "cors";
import { usersRouter } from "./routes/users.routes.js";
import { ordersRouter } from "./routes/orders.routes.js";
import { businessesRouter } from "./routes/businesses.routes.js";
import { options } from "./config/options.js";

const app = express();
const {
  server: { port },
} = options;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(port, () => {
  console.log(`Sever listening at http://localhost:${port}`);
});

app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/businesses", businessesRouter);