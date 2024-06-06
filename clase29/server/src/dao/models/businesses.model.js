import mongoose from "mongoose";

const businessesSchema = new mongoose.Schema({
  name: String,
  products: [],
});

export const businessesModel = mongoose.model("businesses", businessesSchema);