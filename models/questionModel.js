const { SchemaTypes, Schema, model } = require("mongoose");
const questionSchema = new Schema(
  {
    course: {
      type: String,
    },
    chapter: {
      type: String,
    },
    quest: {
      type: String,
      required: true,
    },
    choices: [
      {
        type: String,
      },
    ],
    answer: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
    },
    level: {
      type: Number,
      required: true,
      default: 0,
    },
    comments: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    collection: "monsterQuestions",
  }
);
let Question = model("Question", questionSchema);
module.exports = Question;
