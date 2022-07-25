const mongoose = require("mongoose")
const Course = require("./courseModel")
const questionSchema = new mongoose.Schema({
    Course:{
        type: String,
        required: true,
    },
    Chapter:{
        type:String,
    },
    Question:{
        type:String,
        required:true
    },
    A:{
        type:String,
    },
    B:{
        type:String,
    },
    C:{
        type:String,
    },
    D:{
        type:String,
    },
    Answer:{
        type:String,
    },
    Type:{
        type:String,
    }
})
let Question = mongoose.model("Question",questionSchema)
module.exports = {Question};