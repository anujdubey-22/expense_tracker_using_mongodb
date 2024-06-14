const express = require("express");
const forgotController = require("../controller/forgotpassword");

const router = express.Router();

router.post("/forgotpassword", forgotController.postForgotpasswaord);

router.post("/resetpassword/:id", forgotController.postResetpassword);

router.post("/updatepassword/:resetpasswordid", forgotController.postUpdatepassword);

module.exports = router;
