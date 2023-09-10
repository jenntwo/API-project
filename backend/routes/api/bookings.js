const express = require('express');
const { Op } = require('sequelize');
const { check, query } = require('express-validator');
const { requireAuth,requireProperAuth,successfulDeleteRes } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, SpotImage, User, sequelize, ReviewImage, Booking } = require('../../db/models');


const router = express.Router();

const validateBooking = [
    check('endDate')
        .custom((endDate, { req }) => {
            // console.log('req.body.startDate:', req.body.startDate);
            // console.log('endDate:', endDate);
            // console.log('req.body.startDate:', new Date(req.body.startDate));
            // console.log('endDate:', new Date(endDate));
            // console.log(new Date(endDate) <= new Date(req.body.startDate));
            if (new Date(endDate) <= new Date(req.body.startDate)) {
                throw new Error('endDate cannot be on or before startDate');
            } else {
                return endDate;
            }
        })
        ////
        .custom(async (endDate, { req }) => {
            const options = { where: {} };
            if (req.booking) {
                options.where.id = { [Op.not]: req.booking.id };
                options.spotId = req.booking.spotId;
            } else {
                options.spotId = req.params.spotId;
            }
            const bookings = await Booking.findAll(options);
            for (const booking of bookings) {
                if (new Date(endDate) >= new Date(booking.startDate) && new Date(endDate) <= new Date(booking.endDate)) {
                    req.message = "Sorry, this spot is already booked for the specified dates";
                    req.status = 403;
                    throw new Error("End date conflicts with an existing booking");
                }
            }
            return endDate;
        }),

    check('startDate')
        .custom(async (startDate, { req }) => {
            const options = { where: {} };
            if (req.booking) {
                options.where.id = { [Op.not]: req.booking.id };
                options.spotId = req.booking.spotId;
            } else {
                options.spotId = req.params.spotId;
            }
            const bookings = await Booking.findAll(options);
            for (const booking of bookings) {
                if (new Date(startDate) >= new Date(booking.startDate) && new Date(startDate) <= new Date(booking.endDate)) {
                    req.message = "Sorry, this spot is already booked for the specified dates";
                    req.status = 403;
                    throw new Error("Start date conflicts with an existing booking");
                }
            }
            return startDate;
        }),
         // Additional custom check for date overlap
    check().custom(async (value, { req }) => {
        const options = { where: {} };
        if (req.booking) {
            options.where.id = { [Op.not]: req.booking.id };
            options.spotId = req.booking.spotId;
        } else {
            options.spotId = req.params.spotId;
        }
        const bookings = await Booking.findAll(options);
        const newStartDate = new Date(req.body.startDate);
        const newEndDate = new Date(req.body.endDate);

        for (const booking of bookings) {
            const existingStartDate = new Date(booking.startDate);
            const existingEndDate = new Date(booking.endDate);

            if (
                (newStartDate >= existingStartDate && newStartDate <= existingEndDate) ||
                (newEndDate >= existingStartDate && newEndDate <= existingEndDate) ||
                (newStartDate <= existingStartDate && newEndDate >= existingEndDate)
            ) {
                req.message = "Sorry, this spot is already booked for the specified dates";
                req.status = 403;
                throw new Error("Date range conflicts with an existing booking");
            }
        }

        return value;
    }),
        handleValidationErrors
];


//Find Review middleware
async function BookingAuth(req,res,next){
    const booking  = await Booking.findByPk(req.params.bookingId);

     //Couldn't find a Review with the id
     if (!booking) {
        return res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }
    req.booking = booking;
    if(req.booking.userId === req.user.id) {
        return next();
    }else{
        requireProperAuth(res);
    }
}




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

// * Edit a Booking
router.put('/:bookingId', requireAuth, BookingAuth, validateBooking, async (req, res) => {

    if (new Date(req.booking.endDate) < new Date()) {
        return res.status(403).json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        });
    }
        const { startDate, endDate } = req.body;
        const record = await req.booking.update({
            id: req.booking.id,
            startDate,
            endDate
        });
        res.status(200).json(record);
});
// * Edit a Booking


// * Delete a Booking
router.delete('/:bookingId',requireAuth,async(req,res)=>{
    //Auth
    const booking  = await Booking.findByPk(req.params.bookingId,{
        include:[{model:Spot}]
    });
    if (!booking) {
        return res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }
    req.booking = booking;
    if(req.booking.userId === req.user.id || req.booking.Spot.ownerId === req.user.id) {
        if (new Date() > new Date(req.booking.startDate)) {
            return res.status(403).json(
                {
                    "message": "Bookings that have been started can't be deleted",
                    "statusCode": 403
                });
        }
        await req.booking.destroy();
        return res.status(200).json({
            "message": "Successfully deleted"
        });

    }else{
        requireProperAuth(res);
    }

} )
// * Delete a Booking



module.exports = router;
