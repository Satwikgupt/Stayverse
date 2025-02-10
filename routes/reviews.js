const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js")
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controller/review.js")

//reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))
//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports= router;