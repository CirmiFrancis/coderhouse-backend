import { connectDB } from "../config/dbConnection.js";
import { BusinessMongo } from "./managers/businesses.mongo.js";
import { OrdersMongo } from "./managers/orders.mongo.js";
import { UserMongo } from "./managers/users.mongo.js";

connectDB();
export const userDao = new UserMongo();
export const orderDao = new OrdersMongo();
export const businessDao = new BusinessMongo();