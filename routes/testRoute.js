const checkController = require("../controllers/checkController");
const { checkToken, checkAdmin } = require("../controllers/checkController");
const testController = require("../controllers/testController");

const testRouter = require("express").Router();
testRouter.post(
  "/addQuestionIds",
  checkController.checkToken,
  checkController.checkToken,
  testController.addQuestionIds
);
testRouter.get(
  "/get/id/:testId",
  checkController.checkToken,
  testController.getTestById
);
module.exports = testRouter;
