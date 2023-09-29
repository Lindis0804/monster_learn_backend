const commentController = require("../controllers/commentController");

const commentRouter = require("express").Router();
commentRouter.delete("/delete", commentController.deleteComments);
module.exports = commentRouter;
