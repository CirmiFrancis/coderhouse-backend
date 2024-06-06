import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  number: String,
  business: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "businesses",
    },
  ],
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  products: [],
  totalPrice: Number,
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
});

export const ordersModel = mongoose.model("orders", orderSchema);