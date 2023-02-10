const Const = require("../const/Const");
const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const checkController = {
  checkToken: async (req, res, next) => {
    console.log("check token");
    try {
      var result = jwt.verify(req.headers.token, Const.secretKey);
      const user = await User.findById(result._id);
      if (user) {
        req.data = result;
        next();
      } else {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Your token is wrong or expired",
      });
    }
  },
  checkAdmin: async (req, res, next) => {
    const { _id } = req.data;
    try {
      const user = await User.findById(_id, {
        _id: 0,
        role: 1,
      });
      console.log(user);
      console.log(user["_id"]);
      console.log(user["role"]);
      if (user["role"]) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "You are not admin.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Check admin fail.",
        err: err,
      });
    }
  },
};
module.exports = checkController;
