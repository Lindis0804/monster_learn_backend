const {SchemaTypes,Schema,model} = require("mongoose")
const Test = require("../models/testModel")
const testHistorySchema = new Schema({
    action:{
        type:String,
        required:true
    },
    data:{
        type:Test,
        required:true
    }
},{
    timestamps:true,
    collection:"TestHistories"
})
const TestHistory = model("TestHistory",testHistorySchema)
module.exports = TestHistory