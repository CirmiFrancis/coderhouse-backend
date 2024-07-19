import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },

    password: {
        type: String,
        //required: true
    },

    age: {
        type: Number,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['admin', 'usuario', 'premium'], // desafío complementario 3
        default: 'usuario'
    },
    resetToken: { // desafío complementario 3
        token: String,
        expire: Date
    }
});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;