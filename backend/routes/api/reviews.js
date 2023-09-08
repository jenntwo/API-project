const express = require('express');
const { requireAuth,requireProperAuth,successfulDeleteRes } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, ReviewImage, Booking } = require('../../db/models');
const { validationResult } = require('express-validator');
const router = express.Router();
const { check, query } = require('express-validator');



//Find Review middleware
async function reviewAuth(req,res,next){
    const review = await Review.findByPk(req.params.reviewId);

     //Couldn't find a Review with the id
     if (!review) {
        return res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }
    req.review = review;
    if(req.review.userId === req.user.id) {
        return next();
    }else{
        requireProperAuth(res);
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


// * Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, reviewAuth, async (req, res) => {
    const imageCount = await ReviewImage.count({
         where: { reviewId: req.params.reviewId
        } });

    //Cannot add any more images
    // because there is a maximum of 10 images per resource
    if (imageCount > 9) {
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
        });
    }

    const newImage = await ReviewImage.create
    ({
        reviewId: req.params.reviewId,
        url: req.body.url
    });
    res.status(200).json({
        id:newImage.id,
        url:newImage.url
});
})
// * Add an Image to a Review based on the Review's id



// * Edit a Review
// * Edit a Review

// * Delete a Review
// * Delete a Review

module.exports = router;
