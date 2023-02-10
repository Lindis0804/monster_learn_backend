const { Course } = require("../models/courseModel");
const Test = require("../models/testModel");

const testController = {
  addQuestionIds: async (req, res, next) => {
    const { questionIds, testId } = req.body;
    try {
      const test = await Test.findByIdAndUpdate(
        testId,
        {
          $addToSet: {
            questions: {
              $each: questionIds,
            },
          },
        },
        {
          new: true,
        }
      ).populate({
        path: "questions",
      });
      return res.status(200).json({
        success: true,
        message: "Add questionIds successfully.",
        data: test,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Add questions fail.",
        err: err,
      });
    }
  },
  getTestById: async (req, res, next) => {
    const { testId } = req.params;
    try {
      const test = await Test.findById(testId).populate({
        path: "questions",
      });
      return res.status(200).json({
        success: true,
        message: "Get test successfully.",
        data: test,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Get test by id fail.",
        err: err,
      });
    }
  },
};
module.exports = testController;
