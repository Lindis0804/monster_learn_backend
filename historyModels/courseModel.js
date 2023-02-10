const {SchemaTypes,Schema,model} = require("mongoose")
const { Course } = require("../models/courseModel")
const courseHistorySchema = new Schema({
    action:{
        type:String,
        required:true
    },
    data:{
        type:Course,
        required:true
    }
},{
    timestamps:true,
    collection:"CourseHistories"
})
const CourseHistory = model("CourseHistory",courseHistorySchema)
module.exports = CourseHistory