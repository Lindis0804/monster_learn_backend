const { default: mongoose } = require("mongoose");
const { Course } = require("../models/courseModel");
const { Question } = require("../models/questionModel");
const Test = require("../models/testModel");
const { User } = require("../models/userModel");
const courseController = {
  //get course list
  getAllCourse: async (req, res, next) => {
    try {
      const courses = await Course.find(
        {},
        {
          chapters: 0,
          tests: 0,
        }
      )
        .populate({
          path: "learners",
          select: "_id name avatar",
        })
        .populate({
          path: "raters",
          select: "_id name avatar",
        })
        .populate({
          path: "likers",
          select: "_id name avatar",
        })
        .populate({
          path: "chapters.questions",
        });
      res.status(200).json({
        success: true,
        data: courses,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Get all course fail.",
        err: err,
      });
    }
  },

  //get course by id
  getCourseById: async (req, res, next) => {
    const user = req.data;
    const { courseId } = req.params;
    try {
      var courses = (await User.findById(user._id, "courses"))?.courses;
      if (!courses) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
      var chapter = 0;
      var numOfDoneCourse = courses.reduce((acc, cur) => {
        cur.done && (acc += 1);
        return acc;
      }, 0);
      var numOfPassChapterQuestion = 0;
      var numOfPassQuestion = 0;
      var done = false;
      var courseIndex = courses
        .map((item) => item.course.toString())
        .indexOf(courseId);
      console.log("courseIndex", courseIndex);
      var course = await Course.findById(courseId, {
        "chapters.questions": 0,
      })?.populate([
        {
          path: "tests",
          select: {
            _id: 1,
          },
        },
        {
          path: "learners",
          select: {
            _id: 1,
          },
        },
        {
          path: "raters",
          select: {
            _id: 1,
          },
        },
        {
          path: "likers",
          select: {
            _id: 1,
          },
        },
      ]);
      if (courseIndex != -1) {
        chapter = courses[courseIndex].chapter;
        numOfPassChapterQuestion =
          courses[courseIndex].numOfPassChapterQuestion;
        numOfPassQuestion = courses[courseIndex].numOfPassQuestion;
        done = courses[courseIndex].done;
      }
      return res.status(200).json({
        success: true,
        data: {
          course: course,
          chapter,
          numOfPassChapterQuestion,
          numOfPassQuestion,
          totalNumOfCourse: await Course.count(),
          numOfDoneCourse,
          done,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Get course by id fail.",
        err: JSON.stringify(err),
      });
    }
  },
  //update course's information
  updateCourse: async (req, res) => {
    const { courseId, ...resData } = req.body;
    try {
      const course = await Course.findByIdAndUpdate(
        courseId,
        {
          $set: resData,
        },
        {
          new: true,
        }
      );
      if (course) {
        return res.status(200).json({
          success: true,
          message: "Update course successfully.",
          course: course,
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Update course fail.",
        err: err,
      });
    }
  },
  rateCourse: async (req, res, next) => {
    const user = req.data;
    const { rate } = req.body;
    const courseId = req.body._id;
    try {
      const course = await Course.findById(courseId);
      if (!course)
        return res.status(404).json({
          success: false,
          message: "Course not found.",
        });
      course.numOfRate += 1;
      course["raters"].push(user._id);
      course["rate"] =
        (course["rate"] * (course["numOfRate"] - 1) + rate) /
        course["numOfRate"];
      await course.save();
      return res.status(200).json({
        success: true,
        message: "Rate course successfully.",
        data: { rate: course["rate"] },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Rate course fail.",
        err: err,
      });
    }
  },
  likeCourse: async (req, res, next) => {
    const user = req.data;
    const { courseId } = req.body;
    try {
      const course = await Course.findById(courseId, "numOfLike likers");
      if (course) {
        const likerIndex = course.likers.indexOf(user._id);
        if (likerIndex < 0) {
          course["numOfLike"] += 1;
          course["likers"].push(user._id);
        } else {
          course["numOfLike"] -= 1;
          course["likers"].pop(user._id);
        }
        await course.save();
        return res.status(200).json({
          success: true,
          message: "Like course successfully.",
          course: course,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Course not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Like course fail.",
        err: err,
      });
    }
  },
  addQuestion: async (req, res, next) => {
    try {
      const courses = await Course.find({});
      for (var course of courses) {
        var questions = (await Question.find({ Course: course["title"] })).map(
          (item) => item._id
        );
        course["questions"] = [
          ...new Set([
            ...course["questions"].map((i) => i.toString()),
            ...questions.map((i) => i.toString()),
          ]),
        ].map((i) => mongoose.Types.ObjectId(i));
        course["numOfQuestion"] = course["questions"].length;
        await course.save();
      }
      return res.status(200).json({
        success: true,
        message: "Add question successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Add question fail.",
        err: err,
      });
    }
  },
  addQuestions: async (req, res, next) => {
    const { courseId, questions } = req.body;
    try {
      var course;
      for (var ques of questions) {
        const question = await Question.create(ques);
        course = await Course.findByIdAndUpdate(
          courseId,
          {
            $addToSet: { questions: question._id },
          },
          {
            new: true,
          }
        );
      }
      return res.status(200).json({
        success: true,
        message: "Add questions successfully.",
        course: course,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Add questions fail.",
        err: err,
      });
    }
  },
  deleteQuestion: async (req, res, next) => {},
  getQuestionByIndex: async (req, res, next) => {
    const { quesIndex, courseId } = req.params;
    const user = req.data;
    try {
      const courses = (await User.findById(user._id, "courses")).courses;
      const courseIndex = courses.map((item) => item.course).indexOf(courseId);
      const numOfPassQuestion = 0;
      if (courseIndex > -1) {
        numOfPassQuestion = courses[courseId]["numOfPassQuestion"];
      }
      const course = await Course.findById(courseId, "questions numOfQuestion");
      if (course) {
        if (quesIndex < numOfPassQuestion) {
          const ques = await Question.findById(course["questions"][quesIndex], {
            Answer: 0,
          });
          if (ques) {
            return res.status(200).json({
              success: true,
              question: ques,
            });
          }
        } else if (quesIndex === numOfPassQuestion) {
          const ques = await Question.findById(course["questions"][quesIndex]);
          if (ques) {
            return res.status(200).json({
              success: true,
              question: ques,
            });
          }
        } else {
          return res.status(403).json({
            success: false,
            message:
              "Please answer your previous question to access this question.",
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "Question not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Get question by index fail.",
        err: err,
      });
    }
  },
  getCoursesOfUser: async (req, res, next) => {
    const user = req.data;
    try {
      var courses = (
        await User.findById(user._id, "courses").populate([
          {
            path: "courses.course",
            select: {
              chapters: 0,
            },
            populate: [
              {
                path: "tests",
                select: {
                  _id: 1,
                },
              },
              {
                path: "learners",
                select: {
                  _id: 1,
                },
              },
              {
                path: "raters",
                select: {
                  _id: 1,
                },
              },
              {
                path: "likers",
                select: {
                  _id: 1,
                },
              },
            ],
          },
          {
            path: "followers",
            select: {
              _id: 1,
            },
          },
        ])
      ).courses;
      if (courses.length === 0) {
        courses = await Course.aggregate([
          {
            $project: {
              chapters: 0,
            },
          },
          {
            $match: {},
          },
          {
            $sample: { size: 5 },
          },
        ]);
        return res.status(200).json({
          success: true,
          message: "Suggest for you.",
          data: courses.map((item) => {
            return {
              course: item,
              chapter: 0,
              numOfPassChapterQuestion: 0,
            };
          }),
        });
      }
      return res.status(200).json({
        success: true,
        data: courses,
        message: "Your courses.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Get courses of user fail.",
        err: JSON.stringify(err),
      });
    }
  },
  addTest: async (req, res, next) => {
    const { courseId, ...resData } = req.body;
    try {
      const test = await Test.create(resData);
      const course = await Course.findByIdAndUpdate(courseId, {
        $push: {
          tests: test._id,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Add test successfully.",
        data: test,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Add test fail.",
        err: err,
      });
    }
  },
  getTestsOfCourse: async (req, res, next) => {
    const { courseId } = req.params;
    if (courseId) {
      try {
        const tests = await Course.findById(courseId, "tests").populate({
          path: "tests",
          select: {
            questions: 0,
          },
        }).tests;
        return res.status(200).json({
          success: true,
          message: "Get tests successfully.",
          data: tests,
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Get tests fail.",
          err: err,
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "CourseId not found.",
      });
    }
  },
  submitTest: async (req, res, next) => {},
};

module.exports = courseController;
