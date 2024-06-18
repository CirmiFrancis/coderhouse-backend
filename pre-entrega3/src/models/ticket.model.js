import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    products: [
        {
            code: { // uuid
                type: String,
            },
            purchase_datetime: { // fecha y hora de la compra
                type: Date,
                required: true
            },
            amount: { // monto total del cart
                type: Number,
                required: true
            },
            purchaser: { // correo electronico
                type: String,
                required: true
            }
            // ,
            // product: {
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: "products",
            //     required: true
            // },
            // quantity: {
            //     type: Number,
            //     required: true
            // }
        }
    ]
})

// ticketSchema.pre('findOne', function (next) { // relaciono el ticket con los productos existentes en la base de datos
//     this.populate('products.product', '_id title price');
//     next();
// });

const TicketModel = mongoose.model("tickets", ticketSchema); // consultado por el service

export default TicketModel;