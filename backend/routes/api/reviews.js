const express = require('express');
const { requireAuth,successfulDeleteRes } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, ReviewImage, Booking } = require('../../db/models');
const { validationResult } = require('express-validator');
const router = express.Router();
const { check, query } = require('express-validator');



//Find Review middleware
async function findReview(req,res,next){
    const review = await Review.findByPk(req.param.reviewId);
        if(review){
            req.review = review;
            return next()
        }else{
            res.status(404).json({
                "message": "Review couldn't be found",
                "statusCode": 404
            })
        }
    }




//* Get all Reviews of the Current User
router.get('/current', requireAuth,  async (req, res) => {
    const reviews = await Review.findAll({
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: {
                    model: SpotImage,
                    attributes: ['url'],
                    where: { preview: true }
                },
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            },
        ],
        where: { userId: req.user.id }
    });

    const fomattedReviews = reviews.map((review,i)=>{
        if (review.Spot && review.Spot.SpotImage) {
            review.Spot.previewImage = review.Spot.SpotImages[0].url;
        }
        return {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            reviewText: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        User: review.User ? { ...review.User.dataValues}:null,
            Spot: review.Spot ? { ...review.Spot.dataValues }:null,
            ReviewImages: review.ReviewImages.map((image) => ({ ...image })),
        }
    })

    res.json({ Reviews:fomattedReviews });
});


// * Get all Reviews by a Spot's id

// * Get all Reviews by a Spot's id


// * Create a Review for a Spot based on the Spot's id
// * Create a Review for a Spot based on the Spot's id

// * Add an Image to a Review based on the Review's id
// * Add an Image to a Review based on the Review's id

// * Edit a Review
// * Edit a Review

// * Delete a Review
// * Delete a Review

module.exports = router;
