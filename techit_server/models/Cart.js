const mongoose = require("mongoose");
const Product = require("./Product");

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'users'
    },
    products: {
        type: Array,
        required: true,
        default: []
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    }
})

const Cart = mongoose.model("carts", cartSchema);
module.exports = Cart;