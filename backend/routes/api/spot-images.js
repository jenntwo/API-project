const express = require('express');
const { requireAuth,requireProperAuth,successfulDeleteRes } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, ReviewImage, Booking } = require('../../db/models');
const router = express.Router();
const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

async function SpotImageAuth(req,res,next){
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    if(spotImage){
        req.spotImage = spotImage;
        const spot = await Spot.findByPk(spotImage.spotId);
        if(spot) req.spot = spot;
        return next();
    }else{
    res.status(404).json({
        "message": "Spot Image couldn't be found",
        "statusCode": 404
     });}
}


// * Delete a Spot Image
router.delete('/:imageId', requireAuth, SpotImageAuth, async (req, res) => {
    if (req.spot && req.spot.ownerId === req.user.id) {
        await req.spotImage.destroy();
        successfulDeleteRes(res);
    }
    else requireProperAuth(res);
});
// * Delete a Spot Image

module.exports = router;
