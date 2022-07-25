
const questionController = require("../controllers/questionController")
const router = require("express").Router()
//render ra course
router.post("/",questionController.addQuestion)
router.get("/",questionController.getAllQuestion)
router.get("/:course/:chapter",questionController.getQuestion)

module.exports = router