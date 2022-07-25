const mongoose = require("mongoose")
const courseSchema = new mongoose.Schema({
  Name:{
    type:String
  },
  NumOfQuestion:{
    type: Number,
  },
  Rate:{
    type:Number
  },
  NumberOfRate:{
    type:Number
  },
  NumberOfLearner:{
    type:Number
  }
})
let Course = mongoose.model("Course",courseSchema)
module.exports = {Course};