import mongoose from "mongoose";

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        //required: true
    },
    email: {
        type: String,
        required: true,
        index: true, 
        unique: true 
    },
    age: {
        type: Number,
        //required: true
    },
    password: {
        type: String,
        //required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId, // hace referencia a un objeto de mongoose
        ref: 'carts', // hace referencia al modelo de 'carts'
        required: true // es obligatorio
    },
    role: {
        type: String,
        required: true
    }
})

// populate() que sirve para encadenar el documento cart generado y sus atributos, al documento user
schema.pre('findOne', function (next) {
    this.populate('cart', '_id products');
    next();
});

const UserModel = mongoose.model("users", schema);

export default UserModel; 