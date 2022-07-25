const {Question} = require("../models/questionModel")
const {Course} = require("../models/courseModel")
const questionController = {
    addQuestion:async (req,res)=>{
        try{
             const newQuestion = new Question(req.body)
             const saveQuestion = await newQuestion.save()
             const course = await Course.findOne({Name:newQuestion["Course"]})
             await course.updateOne({$set:{"NumOfQuestion":course.NumOfQuestion+1}})
             res.status(200).json(saveQuestion)
        }
        catch(err){
            res.status(500).json(err);
        }
    },
    //render các câu hỏi 
    getQuestion: async (req,res) =>{
        try{
            if (req.params.chapter != "null"){
            const question = await Question.find({Course:req.params.course,Chapter:req.params.chapter})
            res.status(200).json(question)
            console.log(question)
            }
            else{
                const question = await Question.find({Course:req.params.course})
            res.status(200).json(question)
            console.log(question)
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    },
    getAllQuestion:async (req,res)=>{
        try{
            const ques = await Question.find()
            res.status(200).json(ques)
            console.log(ques)
        }
        catch(err){
            res.status(500).json(err);
        }
    }
}
module.exports = questionController;