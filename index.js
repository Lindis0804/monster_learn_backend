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
app.get("/", (req, res) => {
  res.send("Hello World!!");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running ... on ${PORT}`);
});
