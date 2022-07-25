const router = require("express").Router()
const courseController = require("../controllers/courseController")

router.get("/",courseController.getCourse)
router.post("/",courseController.addCourse)
router.get("/:name",courseController.getCourseByName)
router.put("/:name",courseController.updateCourse)
module.exports = router