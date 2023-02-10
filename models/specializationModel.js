const mongoose = require("mongoose")
const {SchemeTypes,Schema,model}=mongoose
const specializationSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    courses:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"Course"
    }],
    delete:{
        type:Boolean,
        default:false
    }
},{
    collection:'monsterSpecializations',
    timestamps:true
})
const Specialization = model("Specialization",specializationSchema)
module.exports = Specialization