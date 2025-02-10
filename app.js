if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express =require("express");
const app = express();
const port =8080;
const mongoose = require('mongoose')
const methodOverride = require("method-override");//for override any method like post,get into delete ,put etc
const path = require("path")//this helps for acquiring path of other files into this folder
const ejsMate = require('ejs-mate');//this is useful for creating various template like boilerplate ,layout etc
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js")
const reviews = require("./routes/reviews.js")
const user = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const dburl =process.env.ATLASDB_URL
main()
.then(()=>{
    console.log("connect to database");
})
.catch((err)=>{
    console.log(err)
})

//connection to mongodb
async function main(){
    await mongoose.connect(dburl)
}

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public"))) //for using css 

const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600
})
const sessionOption ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}



app.use(session(sessionOption));
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user
    next()
})
//we use locals because its helpful for rendering the page in short code
// app.get("/demo",async(req,res)=>{
//     const user = new User({
//         email:"abc@gmail.com",
//         username:"Delta"
//     })
//    const RegisteredUser = await User.register(user,"Abc@123");
//    console.log(RegisteredUser);
// })

app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews)
app.use("/",user)

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})
app.use((err,req,res,next)=>{
    let {status = 404,message="something went wrong"} = err;
    res.status(status).render("error.ejs",{message})
})
app.listen(port,(req,res)=>{
    console.log("port listening on the 8080")
})