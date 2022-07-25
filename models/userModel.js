const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
 Name:{
    type:String,
    required: true
 },
 Address:{
    type:String,
    required:true
 },
 Username:{
    type:String,
    required:true,
 },
 Password:{
    type:String,
    required:true
 },
 Phone:{
    type:String,
    required:true
 },
 Coins:{
    type:Number,
 },
 Course:[
    {
        type:{
         course:{
         type:String
        },
        numOfQuestion:{
         type:Number
        }
      }
    }
 ]
})
let User = mongoose.model("User",userSchema)
module.exports = {User};