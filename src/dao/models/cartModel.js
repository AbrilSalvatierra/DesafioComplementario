import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    stock: Number,
    total: Number,
    country: String,
    state: String,
    city: String,
    street: String,
    phone: Number,
    cardBank: Number,
    securityNumber: Number,
    date: {
        type: Date,
        default: Date.now,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;