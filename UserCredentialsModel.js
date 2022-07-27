const mongoose = require("mongoose");

//User Model
const UserCredentialsSchema = new mongoose.Schema({
    email_id : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    }
})
module.exports=mongoose.model("UserCredentialsModel",UserCredentialsSchema);