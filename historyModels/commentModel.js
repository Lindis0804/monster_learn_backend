const mongoose = require("mongoose")
const Comment = require("../models/commentModel")
const {SchemaTypes,Schema,model} = mongoose
const commentHistorySchema = new Schema({
    action:{
        type:String,
        required:true
    },
    data:{
        type:Comment,
        required:true
    }
},{
    timestamps:true,
    collection:"commentHistories"
})
const CommentHistory = model("CommentHistory",commentHistorySchema)
module.exports = CommentHistory