const router = require("express").Router();
const userController = require("../controllers/userController");
const checkController = require("../controllers/checkController");
const { checkToken } = require("../controllers/checkController");
router.post("/signIn", userController.signIn);
router.post("/signUp", userController.signUp);
router.post("/signUp/verify", userController.verifyOtp);
router.put(
  "/update",
  checkController.checkToken,
  userController.updateInformation
);
router.get(
  "/getAll",
  checkController.checkToken,
  userController.getAllUserInformation
);
router.get(
    "/get",
    checkController.checkToken,
    userController.getUser
)
router.get("/get/:userId", checkController.checkToken, userController.getUserById);
module.exports = router;
