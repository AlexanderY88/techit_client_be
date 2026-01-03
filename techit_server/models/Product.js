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
            required: true
        },
        description: {
            type: String
        },
        image: {
            type: String
        }
    }
)

const Product = mongoose.model("products", productSchema);
module.exports = Product;