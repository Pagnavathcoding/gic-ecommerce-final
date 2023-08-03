const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    product: {
        type: String,
        require: true,
        unique: true,
    },
    firstName: {
        type: String,
        require: true,
        unique: true,
    },
    lastName: {
        type: String,
        require: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        require: true,
        unique: true,
    },
    emailAddress: {
        type: String,
        require: true,
        unique: true,
    },
    address: {
        type: String,
        require: true,
        unique: true,
    },
    message: {
        type: String,
        require: true,
        unique: true,
    },
    date: {
        type: String,
        require: true,
        unique: true,
    }
})

module.exports = mongoose.model("Cart", CartSchema);