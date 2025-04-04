
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    clientName:{
        type: String,
        required: true,
        trim: true
    },
    clientPhoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    itemsNo:{
        type: Number,
        required: true,
        trim: true
    },
    furnitureType: {
        type: Array,
        trim: true
    },
    vehicleType: {
        type: String,
        required: true,
        trim: true
    }

});

module.exports = mongoose.model('Booking', bookingSchema);