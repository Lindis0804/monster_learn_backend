const router = require("express").Router()
const userController = require("../controllers/userController")
router.get("/",userController.getInformation)
router.post("/signIn",userController.signIn)
router.post("/signUp",userController.signUp)
router.post("/update",userController.updateInformation)
router.post("/update_user_course",userController.updateUserCourse)
module.exports = router