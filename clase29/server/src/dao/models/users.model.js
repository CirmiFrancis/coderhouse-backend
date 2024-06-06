import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  rol: String,
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },
  ],
});

export const userModel = mongoose.model("users", userSchema);