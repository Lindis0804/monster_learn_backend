const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoute");
const specializationRoute = require("./routes/specializationRoute");
const cloudRouter = require("./routes/cloudRoute");
const testRouter = require("./routes/testRoute");
const questionRoute = require("./routes/questionRoute");
const courseRoute = require("./routes/courseRoute");
const commentRouter = require("./routes/commentRoute");
const jwt = require("jsonwebtoken");
dotenv.config();
//connect database
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connected mongodb");
});
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("common"));
app.use("/question", questionRoute);
app.use("/course", courseRoute);
app.use("/spe", specializationRoute);
app.use("/user", userRoute);
app.use("/cloudinary", cloudRouter);
app.use("/test", testRouter);
app.use("/comment", commentRouter);
app.get("/", (req, res) => {
  res.send("Welcome to monster learn.!!");
});
const PORT = process.env.PORT || 4000;

var server = app.listen(PORT, () => {
  console.log(`server is running ... on ${PORT}`);
});
const io = require("socket.io")(server);
const fs = require("fs");
const Question = require("./models/questionModel");
const Comment = require("./models/commentModel");
const Const = require("./const/Const");
var usernames = [];
var res;
var questionCommentSockets = {};
io.sockets.on("connection", (socket) => {
  console.log("A person connect");
  console.log(typeof socket);
  socket.on("client send username", (data) => {
    console.log("client send username = " + data);
    if (usernames.indexOf(data) == -1) {
      usernames.push(data);
      socket.un = data;
      res = true;
    } else {
      console.log("username exist.");
      res = false;
    }
    socket.emit("server send message", {
      data: {
        res,
      },
    });
    io.sockets.emit("users", {
      data: {
        users: usernames,
      },
    });
  });
  socket.on("join", (data) => {
    var obj = JSON.parse(data);
    var user = {};
    console.log(data, obj);
    if (obj != null && obj.questionId != null) {
      user = jwt.verify(obj.token, Const.secretKey);
      socket.join(obj.questionId);
      socket.un = {
        user,
        questionId: obj.questionId,
      };
    } else console.log("data not found.");
    Question.findById(obj.questionId, "_id comments")
      .populate({
        path: "comments",
        select: "_id author content",
        populate: [
          {
            path: "author",
            select: "_id avatar coins name",
          },
        ],
      })
      .then((question) => {
        io.sockets.in(obj.questionId).emit("get question comment", {
          message: "Get comments successfully.",
          data: {
            comments: question.comments,
          },
        });
      });
    socket.on("post question comment", async (data) => {
      const { user, questionId } = socket.un;
      var content = JSON.parse(data);
      console.log("content", content);
      var comment = await Comment.create({
        author: user._id,
        content: content.content,
      });
      var question = await Question.findByIdAndUpdate(questionId, {
        $addToSet: {
          comments: comment._id,
        },
      });
      Question.findById(obj.questionId, "_id comments")
        .populate({
          path: "comments",
          select: "_id author content",
          populate: [
            {
              path: "author",
              select: "_id avatar coins name",
            },
          ],
        })
        .then((question) => {
          io.sockets.in(obj.questionId).emit("get update question comment", {
            message: "Get comments successfully.",
            data: {
              comments: question.comments,
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});
//get comments by questionId
// Question.find({}, "_id comments")
//   .populate({
//     path: "comments",
//     select: "_id author content",
//     populate: [
//       {
//         path: "author",
//         select: "_id avatar coins name",
//       },
//     ],
//   })
//   .then((questions) => {
//     for (var question of questions) {
//       io.sockets.in(question._id).emit("get question comment", {
//         message: "Get data successfull",
//         data: question.comments,
//       });
//     }
//   })
//   .catch((err) => {
//     console.log(err);
//   });
//gui toi nguoi vua gui
// io.sockets.emit("server send message", {
//   data: {
//     content: "Hello",
//   },
// });
//
