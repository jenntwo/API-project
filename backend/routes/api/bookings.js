const express = require('express');
const { Op } = require('sequelize');
const { check, query } = require('express-validator');
const { requireAuth,requireProperAuth,successfulDeleteRes } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, SpotImage, User, sequelize, ReviewImage, Booking } = require('../../db/models');


const router = express.Router();
// * Get all of the Current User's Bookings
router.get('/current', requireAuth, async(req,res)=>{
    const op = {
        include:[
            {
                model:Spot,
                include:{
                    model:SpotImage,
                    attribute:['url'],
                    where:{
                        preview:true
                    },
                }
            }
        ],
        where:{userId:req.user.id}
    };
    const bookings = await Booking.findAll(op);
    const formattedBookings = bookings.map((booking)=>{
        const bookingJson = booking.toJSON();
        if(bookingJson.Spot){
            console.log(bookingJson.Spot.SpotImages);
            if(bookingJson.Spot.SpotImages){
            bookingJson.Spot.previewImage = bookingJson.Spot.SpotImages[0].url
            }else{
                bookingJson.Spot.previewImage = null
            }
        }
        return {
            id: bookingJson.id,
            spotId: bookingJson.spotId,
            Spot: {
                id: bookingJson.Spot.id,
                ownerId: bookingJson.Spot.ownerId,
                address: bookingJson.Spot.address,
                city: bookingJson.Spot.city,
                state: bookingJson.Spot.state,
                country: bookingJson.Spot.country,
                lat: bookingJson.Spot.lat,
                lng: bookingJson.Spot.lng,
                name: bookingJson.Spot.name,
                price: bookingJson.Spot.price,
                previewImage: bookingJson.Spot.previewImage
            },
            userId: bookingJson.userId,
            startDate: bookingJson.startDate,
            endDate: bookingJson.endDate,
            createdAt: bookingJson.createdAt,
            updatedAt: bookingJson.updatedAt,
        }
    });
        res.status(200).json({Bookings:formattedBookings});
})
// * Get all of the Current User's Bookings

// * Get all Bookings for a Spot based on the Spot's id
// * Get all Bookings for a Spot based on the Spot's id

module.exports = router;
