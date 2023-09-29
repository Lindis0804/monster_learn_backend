const checkController = require("../controllers/checkController");
const questionController = require("../controllers/questionController");
const router = require("express").Router();
//render ra course
router.post("/", questionController.addQuestion);
router.get("/", questionController.getAllQuestion);
router.get("/:course/:chapter", questionController.getQuestion);
router.post(
  "/answer",
  checkController.checkToken,
  questionController.answerQuestionByIndex
);
router.get(
  "/get/:courseId/:chapter/:index",
  checkController.checkToken,
  questionController.getQuesionByIndex
);
router.get(
  "/getPrevious/:courseId/:chapter/:index",
  checkController.checkToken,
  questionController.getPreviousQuestionByIndex
);
router.get(
  "/comments",
  checkController.checkToken,
  questionController.getCommentsOfQuestion
);
module.exports = router;
