const checkController = require("../controllers/checkController");
const specializationController = require("../controllers/specializationController");

const specializationRoute = require("express").Router();
specializationRoute.get(
  "/getAll",
  checkController.checkToken,
  specializationController.getSpecializations
)
specializationRoute.get(
  "/get/:specializationId",
  checkController.checkToken,
  specializationController.getSpecialization
);
specializationRoute.post(
  "/add",
  checkController.checkToken,
  checkController.checkAdmin,
  specializationController.addSpecialization
);
specializationRoute.put(
  "/update",
  checkController.checkToken,
  checkController.checkAdmin,
  specializationController.updateSpecialization
);
specializationRoute.delete(
  "/delete",
  checkController.checkToken,
  checkController.checkAdmin,
  specializationController.deleteSpecialization
);
specializationRoute.post(
  "/addCourses",
  checkController.checkToken,
  checkController.checkAdmin,
  specializationController.addCourses
)
specializationRoute.post(
  "/addCourse",
  checkController.checkToken,
  checkController.checkAdmin,
  specializationController.addCourse
)
specializationRoute.delete(
  "/deleteCourses",
  checkController.checkToken,
  checkController.checkAdmin,
  specializationController.deleteCourses
)
specializationRoute.delete(
  "/deleteCourse",
  checkController.checkToken,
  checkController.checkAdmin,
  specializationController.deleteCourse
)
module.exports = specializationRoute