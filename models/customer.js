const mongoose = require("mongoose");
const Joi = require("joi")

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    isGold: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
        minlength: 2,
    },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(genre) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(2)
    };

    return Joi.validate(genre, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;