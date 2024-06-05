import mongoose from "mongoose";
import { options } from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(options.mongo.url);
    console.log("Database connected");
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};