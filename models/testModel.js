const mongoose = require("mongoose");
const { SchemaTypes, Schema, model } = mongoose;
const testSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Question",
      },
    ],
    time: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "monsterTests",
    timestamps: true,
  }
);
const Test = model("Test", testSchema);
module.exports = Test;
