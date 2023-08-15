const express=require('express');
const router=express.Router({mergeParams:true});
const {validateReview,isloggedIn,isReviewAuthor}=require('../middleware')
const review=require('../controllers/reviews')
const catchAsync=require('../utils/catchAsync')
router.post('/',isloggedIn,validateReview,catchAsync(review.createReview))
router.delete('/:reviewId',isloggedIn,isReviewAuthor,catchAsync(review.deleteReview))
module.exports=router;