import mongoose from "mongoose";
import { options } from "./options.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(options.mongo.url);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};