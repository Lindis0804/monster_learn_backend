const Comment = require("../models/commentModel");

const commentController = {
  socketGetCommentsByQuestionId: (socket, data, questionId) => {},
  deleteComments: async (req, res, next) => {
    try {
      await Comment.deleteMany({});
      return res.status(200).json({
        success: true,
      });
    } catch (err) {}
  },
};
module.exports = commentController;
