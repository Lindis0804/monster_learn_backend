const mongoose = require("mongoose");
const {SchemaTypes,Schema,model} = mongoose
const otpSchema = new Schema(
  {
    gmail: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 300 },
    },

    //After 5 minutes it is deleted automatically from the database
  },
  { timestamps: true, collection: "monsterOtps" }
);
let Otp = model("Otp", otpSchema);
module.exports = { Otp };
