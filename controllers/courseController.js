const {Course} = require("../models/courseModel")
const courseController = {
    addCourse:async (req,res)=>{
        try{
             const newCourse = new Course(req.body)
             const saveCourse = await newCourse.save()
             res.status(200).json(saveCourse)
        }
        catch(err){
            res.status(500).json(err);
        }
    },

    //get course list
    getCourse: async (req,res)=>{
        try{
             const course = await Course.find()
             res.status(200).json(course)
        }
        catch(err){
            res.status(500).json(err)
        }
    },

    //get course by name
    getCourseByName: async (req,res)=>{
        try{
            const course = await Course.find({Name:req.params.name})
            res.status(200).json(course[0])
        }
        catch(err){
            res.status(500).json(err)
        }
        },
    //update course's information
    updateCourse: async (req,res) =>{
        try{
            const course = await Course.findOne({Name:req.params.name})
            await course.updateOne({$set: req.body})
            res.status(200).json(course)
        }
        catch(err){
            res.status(500).json(err)
        }
    }

}
module.exports = courseController