const {SchemaTypes,Schema,model} = require("mongoose")
const UserHistorySchema = new Schema({
    action:{
        type:String,
        required:true
    },
    data:{
        type:User,
        required:true
    }
},{
    timestamps:true,
    collection:"UserHistories"
})
const UserHistory = model("UserHistory",UserHistorySchema)
module.exports = UserHistory