const mongoose = require('mongoose');

const contact_Schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    contact_data: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('contact', contact_Schema);