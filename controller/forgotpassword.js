const Forgotpassword = require("../models/forgotpassword");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const axios = require("axios");
const  mongoose  = require("mongoose");

exports.postForgotpasswaord = async (req, res, next) => {
  try {
    console.log("in postForgotpassword in frgotpassword controller");
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    console.log(user, "user in forgotpassword");
    if (user) {
      const id = new mongoose.Types.ObjectId;

      const forgot = await Forgotpassword.create({
        _id: id,
        userId: user._id,
        isactive: true,
      });

      const data = await axios.post(
        `http://localhost:3000/password/resetpassword/${id}`
      );
      //res.redirect('/password/resetpassword/${id}');
      console.log(data, "data in forgotpassword controllerrr");

      res.status(202).json({ objectId:id, success: true });
      // sgMail.setApiKey(process.env.SENGRID_API_KEY);

      // const msg = {
      //   to: email,
      //   from: "abc@gmail.com",
      //   subject: "Forgot password",
      //   text: "forgot password link generated successfully click on thelink to reset password",
      //   html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
      // };

      // const response = await sgMail.send(msg);
      // res.status(response[0].statusCode).json({
      //   message: "Link to reset your password sent to your mail ",
      //   sucess: true,
      // });
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (error) {
    console.log(error, "error in postforgotpassword");
  }
};

exports.postResetpassword = async (req, res, next) => {
  try {
    console.log("in postRestpasswordddd", req.params);
    const id = req.params.id;
    console.log(id, "iddddddddddd in postrestpassword");
    const forgotpasswordrequest = await Forgotpassword.findOne({ _id: id });
    console.log(
      forgotpasswordrequest,
      "forgotpasswordrequest in reset password"
    );
    if (forgotpasswordrequest.isactive) {
      forgotpasswordrequest.isactive=false;
      await forgotpasswordrequest.save()
      console.log(forgotpasswordrequest,'forgotpasswordrequest after change');

      res.status(200).send("ok");
    } else {
      throw new Error("forgotpasswordrequest expired doesnt exist");
    }
  } catch (error) {
    console.log(error, "error in post resetpassword");
  }
};

exports.postUpdatepassword = async (req, res, next) => {
  try {
    console.log("in postupdatepasswordddddd ");
    const { newpassword } = req.body;
    const { resetpasswordid } = req.params;
    console.log(req.body, req.params, "newpassword and resetpassworid");

    const resetpasswordrequest = await Forgotpassword.findOne({
      _id: resetpasswordid,
    });
    console.log(resetpasswordid, "resetpasswordid in get update");

    const user = await User.findOne({
      _id: resetpasswordrequest.userId,
    });

    console.log(user,'user in postupdatepassword in forgotpassword controller')

    if (user) {
      const saltRounds = 10;
      bcrypt.hash(newpassword, saltRounds, async (err, hash) => {
        try {
          if (err) {
            throw new Error("new password doent encrypted in postupdatepassword");
          } else {
            // Store hash in your password DB.
            user.password=hash;
            await user.save();
            console.log(user,'user after updating password')
            res
              .status(201)
              .json({ message: "Successfuly updated the new password" });
          }
        } catch (error) {
          console.log(error,'error in updating user password')
          throw new Error(error,'error in updating user password');
        }
      });
    } else {
      console.log("user not defined in postUpdatepassword");
    }
  } catch (error) {
    console.log(error, "error in get update password");
    return res.status(403).json({ error, success: false });
  }
};
