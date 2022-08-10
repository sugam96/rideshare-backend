
const mongoose = require("mongoose");

//Ride Model
const RideRequestSchema = new mongoose.Schema({

    user_id: {
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
    }
})
module.exports = mongoose.model("RideRequestModel", RideRequestSchema);