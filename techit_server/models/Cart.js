const mongoose = require("mongoose");
const Product = require("./Product");

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'users'
    },
    products: [{
        productId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1
        }
    }],
    isActive: {
        type: Boolean,
        default: true,
        required: true
    }
})

const Cart = mongoose.model("carts", cartSchema);
module.exports = Cart;