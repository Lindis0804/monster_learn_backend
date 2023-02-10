const { Course } = require("../models/courseModel");
const Specialization = require("../models/specializationModel");

const specializationController = {
  getSpecializations:async (req,res,next)=>{
      try{
        const spes = await Specialization.find({}).populate({
          path:"courses",
          select:{
            chapters:0
          }
        })
        return res.status(200).json({
          success:true,
          data:spes
        })
      }
      catch(err){
        return res.status(500).json({
          success:false,
          message:"Get specializations fail.",
          err:JSON.stringify(err)
        })
      }
  },
  getSpecialization: async (req, res, next) => {
    try {
      const { specializationId } = req.params;
      const specialization = await Specialization.findOne(
        {
          _id: specializationId,
          delete: false,
        },
        {
          delete: 0,
        }
      ).populate({
        path: "courses",
      });
      if (specialization) {
        return res.status(200).json({
          success: true,
          data: specialization,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Specialization not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Get specialization fail.",
        err: err,
      });
    }
  },
  addSpecialization: async (req, res, next) => {
    try {
      const { title } = req.body;
      const temp = await Specialization.findOne({
        title: title,
        delete: false,
      });
      if (temp) {
        return res.status(300).json({
          success: false,
          message: "Specialization title already existed.",
        });
      } else {
        const specialization = await Specialization.create(req.body);
        return res.status(200).json({
          success: true,
          message: "Add specialization successfully.",
          data: specialization,
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Add specialization fail.",
        err: err,
      });
    }
  },
  updateSpecialization: async (req, res, next) => {
    const { specializationId, ...resData } = req.body;
    try {
      const specialization = await Specialization.findOneAndUpdate(
        {
          _id: specializationId,
          delete: false,
        },
        resData,
        {
          new: true,
        }
      );
      if (specialization) {
        return res.status(200).json({
          success: true,
          message: "Update specialization successfully.",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Specialization not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Update specialization fail.",
        err: err,
      });
    }
  },
  addCourse: async (req, res, next) => {},
  addCourses: async (req, res, next) => {
    const { courses } = req.body;
    try {
      for (var c of courses) {
        const { title, speId } = c;
        var course = await Course.findOne({ title: title });
        if (!course) {
          course = await Course.create(c);
          const specialization = await Specialization.findByIdAndUpdate(speId, {
            $addToSet: {
              courses: course._id,
            },
          });
        }
      }
      return res.status(200).json({
        success: true,
        message: "Add course successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Add course fail.",
        err: err,
      });
    }
  },
  deleteCourses: async (req, res, next) => {},
  deleteCourse: async (req, res, next) => {
    return res.json("Del course");
  },
  deleteSpecialization: async (req, res, next) => {},
};
module.exports = specializationController;
