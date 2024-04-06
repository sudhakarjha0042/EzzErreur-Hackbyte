const express = require("express");
const router = express.Router();
const Usermodel = require("../models/UserModel");
const { verifyUser } = require("../middlewares/auth_middleware");

const {
  createUser,
  getUserProfile,
  takeEmailSendOtp,
  verifyOtp,
  login,
  updateUser,
  logout,
  checkField,
  getRandomUserProfile,
} = require("../controller/userController");

// userPostroute

//public routes
router.post("/checkfield", checkField);
router.post("/createuser", createUser);
// router.post("/sendotp", takeEmailSendOtp);
// router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);
// router.post("/createuser/:refid", referCreateUser);

//private routes
router.get("/getuser", verifyUser, getUserProfile);
router.put("/updateuser", verifyUser, updateUser);
router.get("/getRandomUserProfile", verifyUser, getRandomUserProfile);

module.exports = router;
