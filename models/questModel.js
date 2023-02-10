const mongoose = require("mongoose")
const dotenv = require('dotenv')
const { Question } = require("./questionModel")
dotenv.config()
//connect database
mongoose.connect(process.env.MONGODB_URL,()=>{
    console.log("Connected mongodb")
})
const {SchemaTypes,Schema,model} = mongoose
const questSchema = new Schema({
    course:{
        type:String
    },
    chapter:{
        type:String
    },
    quest:{
        type:String,
        required:true
    },
    choices:[
        {
            type:String
        }
    ],
    answer:{
        type:String,
        required:true
    },
    type:{
        type:Number
    },
    level:{
        type:Number,
        required:true,
        default:0
    },
    comments:[
        {
            type:SchemaTypes.ObjectId,
            ref:'Comment'
        }
    ]
},{
    collection:"monsterQuestions"
})
let Quest = model("Quest",questSchema)
module.exports = Quest