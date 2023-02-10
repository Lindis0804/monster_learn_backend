const mongoose = require("mongoose")
const {SchemaTypes,Schema,model} = mongoose
const commentSchema = new Schema({
    author:{
        type:SchemaTypes.ObjectId,
        ref:'User',
        required:true
    },
    content:{
        type:String,
        required:true
    },
    likers:[{
        type:SchemaTypes.ObjectId,
        ref:'User'
    }],
    replies:[{
        type:SchemaTypes.ObjectId,
        ref:'Comment'
    }],
    replied:{
        type:SchemaTypes.ObjectId,
        ref:'Comment'
    }
},{
    collection:'monsterComments'
})
const Comment = model("Comment",commentSchema)
module.exports = Comment