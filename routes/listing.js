const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controller/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

router.route("/")
  //index route
  .get(wrapAsync(listingController.index))
  //create route
  .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.create))



//new route
router.get("/new", isLoggedIn ,listingController.newFormRender)
router.route("/:id")
  //show route
  .get(wrapAsync(listingController.show))
  //update route
  .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.update))
  //delete route
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.delete))
  
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingController.edit))




module.exports= router;