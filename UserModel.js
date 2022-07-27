const mongoose = require("mongoose");
//User Model
const UserSchema = new mongoose.Schema({
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
        required: [true, "Please Enter Date of Birth"]
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
    }
})
module.exports=mongoose.model("UserModel",UserSchema);