const express = require("express")
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js")

router.route("/signup")
.get(userController.signUpForm)
.post(wrapasync(userController.signUp))

router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl,passport.authenticate('local',{ failureRedirect:'/login',failureFlash:true}),userController.loginAuthentication)

router.get("/logout",userController.logOut)

module.exports= router;