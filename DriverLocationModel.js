
const mongoose = require("mongoose");

//Ride Model
const DriverLocationSchema = new mongoose.Schema({

    driver_id: {
        type: String,
        required: true
    },
    location: {
        type: Object,
        required: true
    },
    previous_location: {
        type: Object,
        default: { "lat": 0, "lng": 0 }
    }
})
module.exports = mongoose.model("DriverLocationlModel", DriverLocationSchema);