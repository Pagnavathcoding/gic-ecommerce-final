const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    brand: {
        type: String,
        required: true,
        unique: false,
    },
    price: {
        type: String,
        required: true,
        unique: false,
    },
    image: {
        type: String,
        required: true,
        unique: false,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: String,
        default: Date.now(),
    }
});

module.exports = mongoose.model("Product", ProductSchema);