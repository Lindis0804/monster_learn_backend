const Question = require("../models/questionModel");
const { Course } = require("../models/courseModel");
const { User } = require("../models/userModel");
const { default: mongoose } = require("mongoose");
const questionController = {
  addQuestion: async (req, res) => {
    try {
      const newQuestion = new Question(req.body);
      const saveQuestion = await newQuestion.save();
      const course = await Course.findOne({ Name: newQuestion["Course"] });
      await course.updateOne({
        $set: { NumOfQuestion: course.NumOfQuestion + 1 },
      });
      res.status(200).json(saveQuestion);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //render các câu hỏi
  getQuestion: async (req, res) => {
    try {
      if (req.params.chapter != "null") {
        const question = await Question.find({
          Course: req.params.course,
          Chapter: req.params.chapter,
        });
        res.status(200).json(question);
        console.log(question);
      } else {
        const question = await Question.find({ Course: req.params.course });
        res.status(200).json(question);
        console.log(question);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllQuestion: async (req, res) => {
    try {
      const ques = await Question.find();
      res.status(200).json(ques);
      console.log(ques);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getTest: async (req, res, next) => {},
  answerQuestionById: async (req, res, next) => {
    const userInfo = req.data;
    const { questId, answer } = req.body;
    try {
      const user = await User.findById(userInfo._id);
      const quest = await Question.findById(questId);
      const course = await Course.findOne({
        chapters: { questions: questId },
      });
      if (course) {
        const quests = course.chapters.reduce((acc, cur) => {
          acc = [...acc, ...cur.questions];
          return acc;
        }, []);
        const questIndex = quests.indexOf(questId);
        const courseIndex = user.courses
          .map((item) => item.course)
          .indexOf(course._id);
        if (courseIndex > -1) {
          const userCourse = user.courses[courseIndex];
          if (questIndex < userCourse.numOfPassQuestion) {
            if (answer === quest.answer) {
              return res.status(200).json({
                success: true,
                message: "Correct answer.",
              });
            } else {
              return res.status(403).json({
                success: false,
                message: "Incorrect answer.",
              });
            }
          } else if (questIndex === userCourse.numOfPassQuestion) {
            if (answer === quest.answer) {
            }
          } else {
            return res.status(403).json({
              success: false,
              message: "You have to answer previous question.",
            });
          }
        } else {
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "Course of question not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Answer question fail.",
        err: JSON.stringify(err),
      });
    }
  },
  answerQuestionByIndex: async (req, res, next) => {
    try {
      const { courseId, chapter, index, answer } = req.body;
      if (
        [courseId, chapter, index, answer].some((item) => item === undefined)
      ) {
        return res.status(404).json({
          success: false,
          message: "CourseId or chapter or index or answer not found.",
        });
      }
      const user = req.data;
      var result = {};
      const userInfo = await User.findById(user._id, "courses coins");
      const userCourses = userInfo.courses;
      const userCourseIndex = userCourses
        .map((item) => item.course.toString())
        .indexOf(courseId);
      // console.log(userCourseIndex);
      if (userCourseIndex > -1) {
        var userCourse = userCourses[userCourseIndex];
        // console.log(userCourse);
        if (
          chapter < userCourse.chapter ||
          (chapter === userCourse.chapter &&
            index < userCourse.numOfPassChapterQuestion)
        ) {
          var course = await Course.findById(courseId)
            .populate({
              path: "chapters.questions",
            })
            .select({
              "chapters.questions": {
                $slice: [index, 1],
              },
            });
          // console.log("course", course);
          var question = course.chapters[chapter].questions[0];
          // console.log("question", question);
          // console.log(answer, question.answer);
          if (answer === question.answer) {
            // console.log(course.chapters[chapter].numOfQuestion - 1);
            // console.log("index", index);
            if (index === course.chapters[chapter].numOfQuestion - 1) {
              // console.log("course.numOfChapter", course.numOfChapter);
              if (chapter < course.numOfChapter) {
                result = {
                  chapter: chapter + 1,
                  index: 0,
                };
                // console.log("result", result);
              } else {
                result = {
                  chapter: chapter,
                  index: index + 1,
                  done: true,
                };
              }
            } else {
              result = {
                chapter: chapter,
                index: index + 1,
              };
              // console.log("result", result);
            }
            // console.log(userInfo.courses[userCourseIndex]);
            return res.status(200).json({
              success: true,
              message: "Correct answer",
              data: {
                courseId,
                chapter: result?.chapter,
                index: result?.index,
                done: result?.done ? true : false,
                numOfQuestion: course.chapters[chapter].numOfQuestion,
              },
            });
          } else {
            return res.status(403).json({
              success: false,
              message: "Incorrect answer.",
              data: {},
            });
          }
        } else if (
          chapter === userCourse.chapter &&
          index === userCourse.numOfPassChapterQuestion
        ) {
          // console.log("here");
          var course = await Course.findById(courseId)
            .populate({
              path: "chapters.questions",
            })
            .select({
              "chapters.questions": {
                $slice: [index, 1],
              },
            });
          var question = course.chapters[chapter].questions[0];
          if (answer === question.answer) {
            userInfo.coins += 10;
            if (index === course.chapters[chapter].numOfQuestion - 1) {
              if (chapter < course.numOfChapter - 1) {
                result = {
                  chapter: chapter + 1,
                  index: 0,
                };
              } else {
                result = {
                  chapter: chapter,
                  index: index,
                  done: true,
                };
                // console.log("result", result);
              }
            } else {
              result = {
                chapter: chapter,
                index: index + 1,
              };
              // console.log("result", result);
            }
            Object.assign(userInfo.courses[userCourseIndex], {
              course: courseId,
              chapter: result?.chapter,
              numOfPassChapterQuestion: result?.index,
              done: result?.done ? true : false,
            });
            // console.log("userInfo", userInfo.courses[userCourseIndex]);
            await userInfo.save();
            return res.status(200).json({
              success: true,
              message: "Correct answer",
              data: {
                courseId,
                chapter: result?.chapter,
                index: result?.index,
                done: result?.done ? true : false,
                numOfQuestion: course.chapters[chapter].numOfQuestion,
              },
            });
          } else {
            return res.status(403).json({
              success: false,
              message: "Incorrect answer.",
              data: {},
            });
          }
        }
      } else {
        if (chapter === 0 && index === 0) {
          var course = await Course.findById(courseId)
            .populate({
              path: "chapters.questions",
            })
            .select({
              "chapters.questions": {
                $slice: [index, 1],
              },
            });
          const question = course.chapters[chapter][0];
          if (answer === question.answer) {
            userInfo.courses.push({
              course: courseId,
              chapter: result?.chapter,
              numOfPassChapterQuestion: result?.index,
              done: result?.done ? true : false,
            });
            await userInfo.save();
            return (
              res.status(200),
              json({
                success: true,
                message: "Correct answer",
                data: {
                  courseId,
                  chapter: result?.chapter,
                  index: result?.index,
                  done: result?.done ? true : false,
                  numOfQuestion: course.chapters[chapter].numOfQuestion,
                },
              })
            );
          } else {
            return res.status(403).json({
              success: false,
              message: "Incorrect answer.",
              data: {},
            });
          }
        } else {
          return res.status(403).json({
            success: false,
            message: "You have to answer previous question.",
            data: {},
          });
        }
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Answer question fail.",
        err: JSON.stringify(err),
        data: {},
      });
    }
  },
  getQuesionByIndex: async (req, res, next) => {
    const user = req.data;
    const { courseId, chapter, index } = req.params || req.body;
    if ([courseId, chapter, index].some((item) => item === undefined)) {
      return res.status(403).json({
        success: false,
        message: "CourseId or chapter or index not found.",
      });
    }
    try {
      var course = await Course.findById(courseId).populate({
        path: "chapters.questions",
        populate: {
          path: "comments",
          populate: [
            {
              path: "author",
              select: "_id name avatar coins",
            },
            {
              path: "likers",
              select: "_id name avatar coins",
            },
            {
              path: "replies",
              populate: [
                {
                  path: "author",
                  select: "_id name avatar coins",
                },
                {
                  path: "likers",
                  select: "_id name avatar coins",
                },
              ],
            },
            {
              path: "replied",
              populate: [
                {
                  path: "author",
                  select: "_id name avatar coins",
                },
                {
                  path: "likers",
                  select: "_id name avatar coins",
                },
              ],
            },
          ],
        },
      });
      if (course) {
        const question = course.chapters[chapter].questions[index];
        if (question)
          return res.status(200).json({
            success: true,
            data: question,
          });
        else
          return res.status(404).json({
            success: false,
            message: "Question not found.",
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
        message: "Get question by index fail.",
        err: JSON.stringify(err),
      });
    }
  },
  getPreviousQuestionByIndex: async (req, res, next) => {
    var { courseId, chapter, index } = req.params;
    if ([courseId, chapter, index].some((item) => item === undefined)) {
      console.log([courseId, chapter, index]);
      return res.status(404).json({
        success: false,
        message: "CourseId or chapter or index not found.",
      });
    }
    try {
      const course = await Course.findById(courseId);
      if (index > 0) index -= 1;
      else {
        if (chapter > 0) {
          chapter -= 1;
          index = course.chapters[chapter].numOfQuestion - 1;
        }
      }
      const questionId = course.chapters[chapter].questions[index];
      const question = await Question.findById(questionId).populate({
        path: "comments",
        populate: [
          {
            path: "author",
            select: "_id name avatar coins",
          },
          {
            path: "likers",
            select: "_id name avatar coins",
          },
          {
            path: "replies",
            populate: [
              {
                path: "author",
                select: "_id name avatar coins",
              },
              {
                path: "likers",
                select: "_id name avatar coins",
              },
            ],
          },
          {
            path: "replied",
            populate: [
              {
                path: "author",
                select: "_id name avatar coins",
              },
              {
                path: "likers",
                select: "_id name avatar coins",
              },
            ],
          },
        ],
      });
      return res.status(200).json({
        success: true,
        message: "Get previous question successfully.",
        data: {
          courseId,
          chapter,
          index,
          numOfQuestion: course.chapters[chapter].numOfQuestion,
          question,
        },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Get previous question by index fail.",
        err: err,
      });
    }
  },
  getQuestionAnswerByIndex: async (req, res, next) => {},
  getCommentsOfQuestion: async (req, res, next) => {
    const { pageSize, page, questionId } = req.query;
    const userId = req.data._id;
    console.log("Get comments of question.");
    try {
      const comments = (
        await Question.findById(questionId).populate({
          path: "comments",
          select: {
            replies: 0,
            replied: 0,
          },
          populate: {
            path: "author",
            select: ["_id", "name", "avatar"],
          },
        })
      ).comments;
      return res.status(200).json({
        success: true,
        comments,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Get comments of question fail.",
      });
    }
  },
};
module.exports = questionController;
