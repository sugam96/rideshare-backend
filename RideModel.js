
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
    dateTime_of_ride: {
        type: Date,
        required: true,
        default: Date.now
    },
    distance: {
        type: Number,
        required: false
    },
    duration: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        required: true
    },
    from_location: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    to_location: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    request_id:{
        type:String,
        required: true
    }
})
module.exports = mongoose.model("RideModel", RideSchema);