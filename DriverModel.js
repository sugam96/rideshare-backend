const mongoose = require("mongoose");

//Driver Model
const DriverSchema = new mongoose.Schema({
    driver_id : {
        type: String,
        required: true
    },
    first_name : {
        type: String,
        required: [true, "Please Enter First Your Name"]
    },
    last_name : {
        type: String,
        required: [true, "Please Enter Last Your Name"]
    },
    date_of_birth: {
        type: Date,
        required: [true, "Please Enter To Date"]
    },
    gender: {
        type: String,
        required: false
    },
    contact_number: {
        type: String,
        required: [true, "Please Enter Contact Number"]
    },
    email_id: {
        type: String,
        required: [true, "Please Enter Email Address"]
    },
    address:{
        type: String,
        required: [ true, "Please Enter Valid Address"]
    },
    licence: {
        type:String,
        required:[true, "Please Enter Your Licence"]
    },
    vehicle_name: {
        type:String,
        required:[true, "Please Enter Vehicle Name"]
    },
    vehicle_number: {
        type:String,
        required:[true, "Please Enter Vehicle Number"]
    }
})
module.exports=mongoose.model("DriverModel",DriverSchema);