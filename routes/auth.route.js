const express = require('express');
const { User, Doctor, Patient } = require('../models/user/user.model');
const bcrypt = require('bcryptjs');
const isEmpty = require("../utils/is-empty");
const UserController = require("../controllers/user/user.controller");
const axios = require("axios");
const response = require("../utils/response");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
module.exports = router;

router.post('/register/:type', authMiddleware(true), async (req, res) => {
  try {
    let result = UserController.verifyRegister(req.body);
    if (!isEmpty(result.errors)) {
      return response(res, 400, null, result.errors, "Fields required");
    }
    let user = await User.findOne({ email: result.data.email }).lean().exec();
    if (user) {
      return response(res, 200, null, true, "Email already registered");
    }
    result.data.password = bcrypt.hashSync(result.data.password, bcrypt.genSaltSync(10));
    // result.data.userType = req.params.type;
    result.data.active = req.params.type == "patient" || false;
    result.data.verified = false;
    switch (req.params.type) {
      case "patient":
        user = new Patient(result.data);
        break;
      case "doctor":
        user = new Doctor(result.data);
        break;
      default: return res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid params" });
    }
    user = (await user.save()).toObject();
    delete user.password;
    let token = jwt.sign({ user: user._id }, process.env.JWT_SECRET);
    response(res, 200, { token, user: user }, false, "User registered successfully");
  } catch (err) {
    console.log(err);
    response(res, 500, null, true, "Something went wrong, Please check error logs");
  }
});

router.post('/login', authMiddleware(true), async (req, res) => {
  try {
    let result = UserController.verifyLogin(req.body);
    if (!isEmpty(result.errors)) {
      return response(res, 400, null, result.errors, "Fields required");
    }
    let user = await User.findOne({ email: result.data.email }).populate("languages symptoms").lean().exec();
    if (!user) {
      return response(res, 200, null, true, "Invalid credentials");
    }
    let matched = bcrypt.compareSync(result.data.password, user.password);
    if (!matched)
      return response(res, 401, null, true, "Invalid Credentials");
    let token = jwt.sign({ user: user._id }, process.env.JWT_SECRET);
    delete user.password;
    response(res, 200, { token, user }, false, "Login successful");
  } catch (err) {
    console.log(err);
    response(res, 500, null, true, "Something went wrong, Please check error logs");
  }
});



router.post('/register/vendor', authMiddleware(true), async (req, res) => {
  try {
    let result = UserController.verifyRegister(req.body);
    console.log(result);
    if (!isEmpty(result.errors)) {
      return response(res, 400, null, result.errors, "Fields required");
    }
    let user = await User.findOne({ email: result.data.email }).lean().exec();
    if (user) {
      return response(res, 200, null, true, "Email already registered");
    }
    result.data.password = bcrypt.hashSync(result.data.password, bcrypt.genSaltSync(10));
    result.data.role = process.env.VENDOR_ROLE;
    user = new User(result.data);
    user = (await user.save()).toObject();
    delete user.password;
    let token = jwt.sign({ user: user._id }, process.env.JWT_SECRET);
    response(res, 200, { token, user: user }, false, "User registered successfully");
  } catch (err) {
    console.log(err);
    response(res, 500, null, true, "Something went wrong, Please check error logs");
  }
});

router.post('/login/mobile', authMiddleware(true), async (req, res) => {
  try {
    let result = UserController.verifyMobileLogin(req.body);
    if (!isEmpty(result.errors)) {
      return response(res, 400, null, result.errors, "Fields required");
    }
    let otp = Math.floor(Math.random() * (999999 - 100000) + 100000);
    let senderid = process.env.MSG_SENDER;
    let message = `${otp} is Your OTP(One Time Password). For Secuirty Reasons, do not share the OTP. `;
    let mobile_no = req.body.mobile_number;
    let authkey = process.env.MSG_AUTH_KEY;
    axios.post(`https://control.msg91.com/api/sendotp.php?otp=${otp}&sender=${senderid}&message=${message}&mobile=${mobile_no}&authkey=${authkey}`)
      .then(resp => {
        if (resp.data.type == "success") {
          response(res, 200, null, false, `OTP sent to ${mobile_no}`);
        } else {
          response(res, 400, null, resp.data, "Otp Not Verified");
        }
      }).catch(err => {
        console.log(err);
      })
  } catch (err) {
    console.log(err);
    response(res, 500, null, true, "Something went wrong, Please check error logs");
  }
});


router.post('/verifyotp/:type', authMiddleware(true), async (req, res) => {
  try {
    let result = UserController.verifyMobileOtp(req.body);
    if (!isEmpty(result.errors)) {
      return response(res, 400, null, result.errors, "Fields required");
    }
    let otp = result.data.otp;
    let mobile_no = result.data.mobile_number;
    let authkey = process.env.MSG_AUTH_KEY;
    axios.post(`https://control.msg91.com/api/verifyRequestOTP.php?authkey=${authkey}&mobile=${mobile_no}&otp=${otp}`).then(async resp => {
      if (resp.data.type == "success") {
        let user = await User
          .findOne({ mobile_number: result.data.mobile_number })
          .lean()
          .exec();
        let role = (req.params.type == "customer" ? process.env.CUSTOMER_ROLE : process.env.VENDOR_ROLE)
        if (!user) {
          user = await (new User({ full_name: "", address: "", mobile_number: result.data.mobile_number, profile_picture: "", role }))
            .save()
        } else {
          if (user && (user.role != role)) {
            return response(res, 400, null, false, "User registered in other app can't login here");
          }
        }
        try {
          let token = jwt.sign({ user: user._id }, process.env.JWT_SECRET);
          return response(res, 200, { user: user, token: token }, false, "OTP Verified");
        } catch (err) {
          console.log(err);
          return response(res, 500, null, true, "Error while generating token");
        }
      } else {
        response(res, 400, null, resp.data, "Error while sending otp");
      }
    })
  } catch (err) {
    console.log(err);
    return response(res, 500, null, true, "Something went wrong");
  }
});

router.get('/me', authMiddleware(), async (req, res) => {
  let user = req.user;
  if (user.userType == "doctor")
    user = await Doctor.findById(req.user._id).populate([{ path: "languages" }, { path: "symptoms" }]).lean().exec();
  // user.role = user.role._id;
  return response(res, 200, { user }, false, "User Details");
});
