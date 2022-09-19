const mongoose = require('mongoose');

const xssdetector_Schema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    sources: Array,
    sinks: Array,
    sources_number: Number,
    sinks_number: Number,
    report: String,
    status: Boolean,
    attack_data: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('xssdetector', xssdetector_Schema);