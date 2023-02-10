const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    chapters: [
      {
        _id: {
          type: SchemaTypes.ObjectId,
          required: true,
          auto: true,
        },
        title: {
          type: String,
          required: true,
          default: "",
        },
        questions: [
          {
            type: SchemaTypes.ObjectId,
            ref: "Question",
          },
        ],
        numOfQuestion: {
          type: Number,
        },
      },
    ],
    numOfChapter: {
      type: Number,
    },
    numOfQuestion: {
      type: Number,
      default: 0,
    },
    tests: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Test",
      },
    ],
    numOfLearner: {
      type: Number,
      default: 0,
    },
    learners: [
      {
        type: SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    rate: {
      type: Number,
      default: 0,
    },
    numOfRate: {
      type: Number,
      default: 0,
    },
    raters: [
      {
        type: SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    avatar: {
      type: String,
    },
    numOfLike: {
      type: Number,
      default: 0,
    },
    likers: [
      {
        type: SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    collection: "monsterCourses",
    timestamps: true,
  }
);
// courseSchema.pre("save",function(next){
//   this.chapters.map(item=>{
//     item.numOfQuestion = item.questions.length
//   })
//   this.numOfChapter = this.chapters.length
//   next()
// })
let Course = mongoose.model("Course", courseSchema);
module.exports = { Course };
