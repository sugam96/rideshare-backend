const mongoose = require("mongoose");

//Driver Model
const DriverCredentialsSchema = new mongoose.Schema({
    email_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model("DriverCredentialsModel", DriverCredentialsSchema);