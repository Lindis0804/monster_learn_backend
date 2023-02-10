//
const bcrypt = require("bcrypt");
const lodash = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const { User } = require("../models/userModel");
const { Otp } = require("../models/otpModel");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const Const = require("../const/Const");
dotenv.config();
const userController = {
  // đăng nhập - post
  signIn: async (req, res) => {
    try {
      const user = await User.findOne({
        username: req.body.username,
        password: req.body.password,
      });
      if (user) {
        const token = jwt.sign({ _id: user._id }, Const.secretKey);
        res.status(200).json({
          success: true,
          token: token,
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Username or password is not correct.",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Sign in fail.",
        message: JSON.stringify(err),
      });
    }
  },
  //đăng kí
  signUp: async (req, res) => {
    const user = await User.findOne({
      gmail: req.body.gmail,
    });
    if (user)
      return res.status(403).json({
        success: false,
        message: "Gmail already existed.",
      });
    const user1 = await User.findOne({
      username: req.body.username,
    });
    if (user1)
      return res.status(403).json({
        success: false,
        message: "Username already existed.",
      });
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const gmail = req.body.gmail;
    console.log(OTP);
    console.log(gmail);
    const otp = new Otp({ gmail: gmail, otp: OTP });
    const salt = await bcrypt.genSalt(10);
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    //gửi mail otp đến người đăng kí

    let transpoter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lindis0804@gmail.com",
        pass: `${process.env.PASSWORD}`,
      },
    });
    console.log(req.body.gmail);
    try {
      await transpoter.sendMail({
        from: "lindis0804@gmail.com",
        to: `${req.body.gmail}`,
        html: `<b>Your OTP is <b>${OTP}<br/>Your OTP will be lost after 5 minutes</b></b>`,
      });
      return res.status(200).send({
        success: true,
        message: "Send message successfully.",
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Send message fail.",
        err: err,
      });
    }
  },
  //verify Otp
  verifyOtp: async (req, res, next) => {
    const otpHolder = await Otp.find({
      gmail: req.body.gmail,
    });
    if (otpHolder.length == 0)
      return res.status(403).json({
        success: false,
        message: "Your Otp is wrong or expired.",
      });
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
    try {
      if (rightOtpFind.gmail === req.body.gmail && validUser) {
        const user = await User.create(req.body);
        console.log(user);
        const token = jwt.sign({ _id: user._id }, Const.secretKey);
        const OTPDelete = await Otp.deleteMany({
          gmail: rightOtpFind.gmail,
        });
        return res.status(200).json({
          success: true,
          message: "Verify successfully.",
          token: token,
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "OTP was wrong or expired.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Verify Otp fail.",
        err: err,
      });
    }
  },

  //trả lại thông tin người dùng
  getAllUserInformation: async (req, res, next) => {
    try {
      const user = await User.find({});
      res.status(200).json({
        success: true,
        users: user,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //cập nhật thông tin cá nhân
  updateInformation: async (req, res, next) => {
    const user = req.data;
    try {
      const userInfo = await User.findByIdAndUpdate(
        user._id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        success: true,
        message: "Update user infomation successfully.",
        user: userInfo,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Update user information fail.",
        err: err,
      });
    }
  },
  getUserById: async (req, res, next) => {},
  getUser: async (req, res, next) => {
    const user = req.data;
    try {
      const userInfo = await User.findById(user._id)
        .select({
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        })
        .populate({
          path: "courses.course",
          select: {
            _id: 1,
            title: 1,
          },
        });
      return res.status(200).json({
        success: true,
        data: userInfo,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Get user fail or user not found.",
        err: JSON.stringify(err),
      });
    }
  },
};
module.exports = userController;
