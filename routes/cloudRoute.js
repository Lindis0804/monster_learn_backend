const uploadCloud = require("../configs/cloudinary.config")

const cloudRouter = require("express").Router()
cloudRouter.post("/upload",uploadCloud.single('file'),(req,res,next)=>{
    if (!req.file){
        next(new Error("No file upload!"))
        return
    }
    const newImage = new UploadedFile({
        title:req.file.filename,
        fileUrl:req.file.path
    })
    newImage.save((err)=>{
        if(err){
            return res.status(500)
        }
    })
    return res.status(200).json({
        secure_url:req.file.path
    })
})
module.exports = cloudRouter