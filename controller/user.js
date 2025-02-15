const User = require("../models/user.js")
const passport = require("passport");

module.exports.signUpForm =(req,res)=>{
    res.render("users/signup.ejs")
}
module.exports.signUp =async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username})
        const registeredUser= await User.register(newUser,password)//study from documentation
        console.log(registeredUser)
        req.login(registeredUser, (err)=> {
            if (err) { 
                return next(err); 
            }
            req.flash("success","User registered Successfully")
            res.redirect("/listings")
          });
        
    }
    catch(er){
        req.flash("error",er.message)
        res.redirect("/signup")
    }
    
}
module.exports.loginForm =(req,res)=>{
    res.render("users/login.ejs")
}
module.exports.loginAuthentication =async(req,res)=>{
    req.flash("success","You are Logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}
module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","you are logged out")
        res.redirect("/listings")
    })
} 