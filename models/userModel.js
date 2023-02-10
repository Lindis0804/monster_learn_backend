const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { SchemaTypes, Schema, model } = mongoose;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatar:{
      type:String
    },
    address: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    coins: {
      type: Number,
    },
    gmail: {
      type: String,
      required: true,
    },
    courses: [
      {
        course: {
          type: SchemaTypes.ObjectId,
          ref: "Course",
        },
        chapter:{
          type:Number
        },
        numOfPassQuestion: {
          type: Number,
        },
        numOfPassChapterQuestion:{
          type:Number
        },
        done:{
          type:Boolean,
          default:false
        }
      },
    ],
    about: {
      type: String,
    },
    birthday: {
      type: String,
    },
    numOfFollower: {
      type: Number,
    },
    followers: [
      {
        type: SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    workPlace: {
      type: String,
    },
    specialization: {
      type: String,
    },
    role: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, collection: "monsterUsers" }
);
userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      Phone: this.Phone,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};
let User = model("User", userSchema);
module.exports = { User };
