const {SchemaTypes,Schema,model} = require("mongoose")
const { Question } = require("../models/questionModel")
const questionHistorySchema = new Schema({
    action:{
        type:String,
        required:true
    },
    data:{
        type:Question,
        required:true
    }
},{
    timestamps:true,
    collection:"QuestionHistories"
})
const QuestionHistory = model("QuestionHistory",questionHistorySchema)
module.exports = QuestionHistory