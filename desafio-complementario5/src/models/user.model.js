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
        enum: ['admin', 'usuario', 'premium'],
        default: 'usuario'
    },
    documents: [{ // desafio complementario 4
        name: String, 
        reference: String 
    }],
    last_connection: { // desafio complementario 4
        type: Date,
        default: Date.now
    },
    resetToken: {
        token: String,
        expire: Date
    }
});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;