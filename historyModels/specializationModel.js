const {SchemaTypes,Schema,model} = require("mongoose")
const Specialization = require("../models/specializationModel")
const specializationHistorySchema = new Schema({
    action:{
        type:String,
        required:true
    },
    data:{
        type:Specialization,
        required:true
    }
},{
    timestamps:true,
    collection:"SpecializationHistories"
})
const SpecializationHistory = model("SpecializationHistory",specializationHistorySchema)
module.exports = SpecializationHistory