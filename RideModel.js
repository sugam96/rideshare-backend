
const mongoose = require("mongoose");

//Ride Model
const RideSchema = new mongoose.Schema({

    user_id: {
        type: String,
        required: true
    },
    driver_id: {
        type: String,
        required: true
    },
    date_of_ride: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    location: {
        type: Array
    }
})
module.exports = mongoose.model("RideModel", RideSchema);