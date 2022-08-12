const mongoose = require("mongoose")
const otpSchema = new mongoose.Schema({
    Gmail:{
        type:String,
        required:true
    },
    Otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        index:{ expires:300 }
    }

    //After 5 minutes it is deleted automatically from the database

},{timestamps:true,collection:"otps"})
let Otp = mongoose.model("Otp",otpSchema)
module.exports = {Otp}