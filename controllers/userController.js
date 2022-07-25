const {User}  = require("../models/userModel")
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
        try{
           const user = await User.findOne({Username:req.body.Username})
           if (user) {
            res.status(400).json("Account exist!!")
           }
           else{
              const newUser = new User(req.body)
              const saveUser = await newUser.save()
              res.status(200).json(saveUser)
           }
        }
        catch(err){
            res.status(500).json(err)
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
    }

}
module.exports = userController;