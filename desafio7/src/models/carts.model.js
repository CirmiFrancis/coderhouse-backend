import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
})

cartSchema.pre('findOne', function (next) { // relaciono el cart con los productos existentes en la base de datos
    this.populate('products.product', '_id title price');
    next();
});

const CartModel = mongoose.model("carts", cartSchema); // consultado por el service

export default CartModel;