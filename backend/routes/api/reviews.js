const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Review, Spot, User, SpotImage, sequelize, ReviewImage } = require('../../db/models');

const router = express.Router();


//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const reviewsCurr = {
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
    };
    const reviews = await Review.findAll(reviewsCurr);
    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i].toJSON();
        if (review.Spot) {
            reviews[i] = review;
            review.Spot.previewImage = review.Spot.SpotImages[0].url;
            delete review.Spot.SpotImages;
            delete review.Spot.description;
        }
    }
    res.json({ Reviews: reviews });
});


module.exports = router;
