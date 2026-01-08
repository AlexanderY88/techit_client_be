const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 2
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true,
            minlength: 2
        },
        description: {
            type: String,
            minlength: 2
        },
        image: {
            type: String,
            default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiYEyBPPDCMMNpynVmbDTjWZjjndDt1Ap8lQ&s"
        },
        quantity: {
            type: Number,
            default: 0,
            min: 0
        }
    }
)

const Product = mongoose.model("products", productSchema);
module.exports = Product;