//
const bcrypt = require("bcrypt")
const lodash = require("lodash")
const axios = require("axios")
const otpGenerator = require('otp-generator')
const nodemailer = require("nodemailer")
const {User}  = require("../models/userModel")
const {Otp} = require("../models/otpModel")
const dotenv = require('dotenv')
dotenv.config()
const userController = {

    // đăng nhập - post
    signIn: async (req,res) =>{
        try{
            const user = await User.findOne({Username: req.body.Username,Password: req.body.Password})
            if (user){
                res.status(200).json(user)
            }
            else{
                
                res.status(401).json({statusCode:300})
            }
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    //đăng kí
    signUp: async (req,res)=>{
       const user = await User.findOne({
        Gmail: req.body.Gmail
       })
       if (user) return res.status(400).json({result:"Gmail existed"})
       const user1 = await User.findOne({
        Username: req.body.Username
       })
       if (user1) return res.status(400).json({result:"Username existed"})
       const OTP= otpGenerator.generate(6,{
        digits:true, lowerCaseAlphabets:false, upperCaseAlphabets:false,specialChars:false
       })
       const gmail = req.body.Gmail
       console.log(OTP)
       console.log(gmail)
       const otp = new Otp({Gmail:gmail,Otp:OTP})
       const salt = await bcrypt.genSalt(10)
       otp.Otp = await bcrypt.hash(otp.Otp,salt)
       const result = await otp.save()
       //gửi mail otp đến người đăng kí
    
       let transpoter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"lindis0804@gmail.com",
            pass:`${process.env.PASSWORD}`
        }
       });
       console.log(req.body.Gmail)
       try{
       await transpoter.sendMail({
          from:"lindis0804@gmail.com",
          to:`${req.body.Gmail}`,
          html:`<b>Your OTP is <b>${OTP}<br/>Your OTP will be lost after 5 minutes</b></b>`
       })
       return res.status(200).send({result:"1"}) //1 :send successfully
       }
       catch(err){
        return res.status(500).send({result:"0"}) //fail
       }
    },
    verifyOtp: async(req,res)=>{
       const otpHolder = await Otp.find({
         Gmail:req.body.Gmail
       })
       if (otpHolder.length == 0) return res.status(400).json({result:"You use an Expired OTP!"})
       const rightOtpFind = otpHolder[otpHolder.length-1]
       const validUser = await bcrypt.compare(req.body.Otp,rightOtpFind.Otp)
       try{
       if (rightOtpFind.Gmail === req.body.Gmail && validUser){
        const user = new User(lodash.pick(req.body,["Username","Password","Address","Name","Phone","Gmail"]))
        const token = user.generateJWT()
        console.log(user)
        const result = await user.save()
        const OTPDelete = await Otp.deleteMany({
            Gmail:rightOtpFind.Gmail
        })
        return res.status(200).json({result:"Register successfully!!"})
       }
       else{
        return res.status(400).json({result:"OTP was wrong!!"})
       }
    }
    catch(err){
        return res.status(500).json(err)
    }
    },

    //trả lại thông tin người dùng
    getInformation: async (req,res) =>{
        try{
            const user = await User.find()
            res.status(200).json(user)
        }
        catch(err){
            res.status(500).json(err)
        }

    },

    //cập nhật thông tin cá nhân + coins
    updateInformation: async (req,res)=>{
        try{
           const user = await User.findOne({Username:req.body.Username})
           await user.updateOne({$set: req.body})
           res.status(200).json(user)
        }
        catch(err){
           res.status(500).json(err)
        }
    },
    //cập nhật số bài tập đã làm trong course của người dùng
    updateUserCourse: async (req,res)=>{
        try{
           const user = User.findOne({Username:res.body.Username})
           user.updateOne({Course:{course:req.body.Course}},{$pull:{Course:{course:req.body.Course}}})
           user.updateOne({Course:{course:req.body.Course}},{$push:{Course:{course:req.body.Course,numOfQuestion:req.body.NumOfQuestion}}})
           res.status(200).json("Update successfully!!!")
        } 
        catch(err){
            res.status(500).json(err)
        }
    },
    getUserInformation: async (req,res)=>{
        try{
            const user = await User.findOne({Username:req.params.Username})
            res.status(200).json(user);
        }
        catch(err){
            res.status(500).json(err);
        }
    }


}
module.exports = userController;