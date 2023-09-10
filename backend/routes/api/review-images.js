const express = require('express');
const { requireAuth,requireProperAuth,successfulDeleteRes } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, ReviewImage, Booking } = require('../../db/models');
const router = express.Router();
const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

async function reviewImageAuth(req,res,next){
    const reviewImage = await reviewImage.findByPk(req.params.imageId);
    if(reviewImage){
        req.reviewImage = reviewImage;
        const review = await Review.findByPk(reviewImage.reviewId);
        if(review) req.review = review;
        return next();
    }else{
    res.status(404).json({
        "message": "Review Image couldn't be found",
        "statusCode": 404
     });}
}


// * Delete a Review Image
router.delete('/:imageId', requireAuth, reviewImageAuth, async (req, res) => {
    if (req.review && req.review.userId === req.user.id) {
        await req.reviewImage.destroy();
        successfulDeleteRes(res);
    }
    else requireProperAuth(res);
});


module.exports = router;
