const express = require('express');
const { Op, where } = require('sequelize');
const { check, query } = require('express-validator');
const { requireAuth,requireProperAuth,successfulDeleteRes } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, SpotImage, User, sequelize, ReviewImage, Booking } = require('../../db/models');


const router = express.Router();

//Spot Validation check
 const validateSpot = [
        check('address')
            .exists({ checkFalsy: true })
            .withMessage('Street address is required.'),
        check('city')
            .exists({ checkFalsy: true })
            .withMessage('City is required.'),
        check('state')
            .exists({ checkFalsy: true })
            .withMessage('State is required.'),
        check('country')
            .exists({ checkFalsy: true })
            .withMessage('Country is required'),
        check('lat')
            .exists({ checkFalsy: true })
            .withMessage('Latitude is not valid'),
        check('lng')
            .exists({ checkFalsy: true })
            .withMessage('Longitude is not valid'),
        check('name')
            .exists({ checkFalsy: true })
            .withMessage('Name is required')
            .isLength({max:50})
            .withMessage('Name must be less than 50 characters'),
        check('description')
            .exists({ checkFalsy: true })
            .withMessage('Description is required'),
        check('price')
            .exists({ checkFalsy: true })
            .withMessage('Price is required'),
            handleValidationErrors

    ];

//Review Validation Check
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isIn([1, 2, 3, 4, 5])
        .withMessage('Stars must be an integer from 1 to 5'),
        handleValidationErrors
];

//Booking Validation Check
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
                return true;
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
            return true;
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
            return true;
        }),
         // Additional custom check for date overlap
    check('Date Range').custom(async (value, { req }) => {
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
                newStartDate <= existingStartDate && newEndDate >= existingEndDate
            ) {
                req.message = "Sorry, this spot is already booked for the specified dates";
                req.status = 403;
                throw new Error("Date range conflicts with an existing booking");
            }
        }

        return true;
    }),
        handleValidationErrors
];

// validate Query
const validateSpotQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than or equal to 1")
        .isInt({ max: 10 })
        .withMessage("Page must be less than or equal to 10"),
    query('size')
        .optional()
        .isInt({ min: 1 })
        .withMessage("Size must be greater than or equal to 1")
        .isInt({ max: 10 })
        .withMessage("Size must be less than or equal to 20"),
    query('minLat')
        .optional()
        .isFloat()
        .withMessage("Minimum latitude is invalid"),
    query('maxLat')
        .optional()
        .isFloat()
        .withMessage("Maximum latitude is invalid"),
    query('minLng')
        .optional()
        .isFloat()
        .withMessage("Minimum longitude is invalid"),
    query('maxLng')
        .optional()
        .isFloat()
        .withMessage("Maximum longitude is invalid"),
    query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be greater than or equal to 0"),
    query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be greater than or equal to 0"),
        handleValidationErrors
];

//middleware for getting new json Spot info
async function getSpots(req,res){
    let {
        page,
        size,
        minLat,
        maxLat,
        minLng,
        maxLng,
        minPrice,
        maxPrice
    } = req.query;


        page = page ? +page : 1;
        size = size ? +size : 20;
        req.query.page = page;
        req.query.size = size;

    const options =
        {
            limit:parseInt(size),
            offset:(page - 1) * size,
            include:[
                {
                    model:Review,
                    attributes:['stars']
                },
                {
                    model:SpotImage,
                    attributes:['url']
                }
            ],
            where:{}
    }


        if (minLat && maxLat) options.where.lat = { [Op.between]: [minLat, maxLat] };
        else if (minLat) options.where.lat = { [Op.gte]: minLat };
        else if (maxLat) options.where.lat = { [Op.lte]: maxLat };

        if (minLng && maxLng) options.where.lng = { [Op.between]: [+minLng, +maxLng] };
        else if (minLng) options.where.lng = { [Op.gte]: +minLng };
        else if (maxLng) options.where.lng = { [Op.lte]: +maxLng };

        if (minPrice && maxPrice) options.where.price = { [Op.between]: [+minPrice, +maxPrice] };
        else if (minPrice) options.where.price = { [Op.gte]: +minPrice };
        else if (maxPrice) options.where.price = { [Op.lte]: +maxPrice };


    const spots = await Spot.findAll(options);

         const formattedSpots = spots.map((spot,i )=>{
            const spotJson = spot.toJSON();
            const reviews = spot.Reviews;
            const spotImages = spot.SpotImages;

            //calculate the avg rating
            if (reviews.length > 0) {
              const sum = reviews.reduce((acc, review) => acc + review.stars, 0);
              spotJson.avgRating = (sum / (reviews.length)).toFixed(1);//round tp decimal
            } else {
              spot.avgRating = 0;
         }

         //get preview image
         if (spotImages.length) {
                spotJson.previewImage = spot.SpotImages[0].url;
              } else {
                spot.previewImage = null;
              };

        return {
            id: spotJson.id,
            ownerId: spotJson.ownerId,
            address: spotJson.address,
            city: spotJson.city,
            state: spotJson.state,
            country: spotJson.country,
            lat: spotJson.lat,
            lng: spotJson.lng,
            name: spotJson.name,
            description: spotJson.description,
            price: spotJson.price,
            createdAt: spotJson.createdAt,
            updatedAt: spotJson.updatedAt,
            avgRating:spotJson.avgRating,
            previewImage:spotJson.previewImage
        }
    });
    return formattedSpots;
}


//Middleware for check proper authorization of current user
async function isSpotOwner(req, res, next){
    const spot = await Spot.findByPk(req.params.spotId);

    //Couldn't find a Spot with the id
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    req.spot = spot;
    if(req.user.id === req.spot.ownerId) {
        return next();
    }else{
        requireProperAuth(res);
    }
}

////Middleware for check proper authorization to create bookings
async function CreateBookingsAuth(req, res, next){
    const spot = await Spot.findByPk(req.params.spotId);

    //Couldn't find a Spot with the id
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    req.spot = spot;
    return next();
}



// const validateSpotQuery = [
    //     query('page')
    //         .optional()
    //         .isInt({ min: 1 })
    //         .withMessage("Page must be a positive integer"),
    //     query('size')
    //         .optional()
    //         .isInt({ min: 1 })
    //         .withMessage("Size must be a positive integer"),
    // ];



//* Get all Spots
router.get('/', validateSpotQuery, async (req, res) => {
    res.json({Spots:await getSpots(req, res)});
});
//* Get all Spots




//* Get Spots owned by the Current User
router.get('/current',requireAuth, async(req,res)=>{
    const allSpotArr = await getSpots(req,res)
    const userSpotsArr = allSpotArr.filter(spot => spot.ownerId === req.user.id)
    res.json({ Spots: userSpotsArr });
});
//* Get Spots owned by the Current User




//* Get detailed of a Spot from an id
router.get('/:spotId',async(req,res)=>{
    const op = {
        include:[
            {
                model:SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model:User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model:Review
            }
        ]
    };

    try{ let spot = await Spot.findByPk(req.params.spotId, op);

        spot.numReviews = spot.Reviews.length;
        // console.log(spot.numReviews);
        if (spot.Reviews.length) {
            const spotReview = spot.Review
            const sum = spot.Reviews.reduce((acc, spotReview) => acc + spotReview.stars, 0);
            // console.log(sum);
            spot.avgStarRating = (sum / (spot.Reviews.length)).toFixed(1);//round tp decimal
          } else {
            spot.avgStarRating = null;
       }

       const spotByPkRes = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews:spot.numReviews,
            avgRating:spot.avgStarRating,
            SpotImages:spot.SpotImages,
            owner:spot.User
       };
       res.status(200).json(spotByPkRes);
    }
    //Error response: Couldn't find a Spot with the specified id
    catch (error) {
        res.status(404).json({ message: "Spot couldn't be found" });
      }
    });


//* Get detailed of a Spot from an id



//*Create a Spot
router.post('/', requireAuth, validateSpot, async(req,res)=>{
    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    } = req.body;

    // Validate the request body

     const newSpot = await Spot.create({
        ownerId: req.user.id,
        ...req.body
     });
      res.status(201).json(newSpot)
});
//* Create a Spot




//* Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images',requireAuth, isSpotOwner, async(req,res)=>{
    const { url, preview } = req.body;
    const spot = req.spot;

    // If couldn't find a Spot with id
    if (!spot){
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const newImage = await SpotImage.create({
        spotId:spot.id,
        url,
        preview
    });

    const newImageRes = {
        id: newImage.id,
        url:newImage.url,
        preview:newImage.preview
      };
    res.status(200).json(newImageRes);
});
//* Add an Image to a Spot based on the Spot's id



//* Edit a spot
router.put(
    '/:spotId',
    requireAuth,
    isSpotOwner,
    validateSpot,
    async(req, res) => {
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
            } = req.body;

        const spot = req.spot;

        // If couldn't find a Spot with id
        if (!spot){
            return res.status(404).json({ message: "Spot couldn't be found" });
        }
        // Validate the request body
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        // }
        //update spot
        const editedSpot = await req.spot.update({...req.body})
        res.status(200).json(editedSpot);
  });
//* Edit a spot



//* Delete a spot
router.delete('/:spotId', requireAuth,isSpotOwner, async(req, res) => {
    const spot = req.spot;
    await req.spot.destroy();
    successfulDeleteRes(res);
  });
//* Delete a spot


// * Get all Reviews by a Spot's id
router.get('/:spotId/reviews', isSpotOwner, async (req, res) => {
    const op = {
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            },
        ],
        where: { spotId: req.params.spotId }
    };

    const reviews = await Review.findAll(op);
    const formatedReviews = reviews.map((review) => {
        const reviewJson = review.toJSON();
        if (reviewJson.Spot) {
            reviewData.Spot.previewImage = reviewData.Spot.SpotImages[0].url;
        }
        return {
                id: reviewJson.id,
                userId: reviewJson.userId,
                spotId: reviewJson.spotId,
                review: reviewJson.review,
                stars: reviewJson.stars,
                createdAt: reviewJson.createdAt,
                updatedAt: reviewJson.updatedAt,
                User: {
                    id: reviewJson.User.id,
                    firstName: reviewJson.User.firstName,
                    lastName: reviewJson.User.lastName
                },
                ReviewImages: reviewJson.ReviewImages
        };
    })
    res.json({ Reviews: formatedReviews });
});
// * Get all Reviews by a Spot's id


// * Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, isSpotOwner, validateReview, async (req, res) => {
    const IsReviewed = await Review.findOne({ where: { userId: req.user.id, spotId: req.params.spotId } });
    if (IsReviewed) {
        return res.status(500).json({
            "message": "User already has a review for this spot",
            "statusCode": 500
        })
    }
        const { review, stars } = req.body;
        const record = await Review.create({
            userId: req.user.id,
            spotId: req.params.spotId,
            review,
            stars });
        res.status(201).json(record);
    })
// * Create a Review for a Spot based on the Spot's id



// * Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }else{
    // console.log(spot);
    if (req.user.id === spot.ownerId) {
        const options = {
            where: { spotId: req.params.spotId },
            include: {
                model: Spot,
                include: {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            }
        };
        const bookings = await Booking.findAll(options);
        // console.log(bookings);
        const formattedBookings = bookings.map((booking)=>{
            const bookingJson = booking.toJSON();
            // console.log(bookingJson);
            if (bookingJson.Spot) {
                // console.log(bookingJson.Spot.User);
                bookingJson.User = bookingJson.Spot.User;
                // console.log(bookingJson.User);
                delete bookingJson.Spot
            }
            return {
                User:bookingJson.User,
                ...bookingJson
            }
        })
            res.json({ Bookings: formattedBookings });

        } else {
        const op = {
            where: { spotId: req.params.spotId },
            attributes: ['spotId', 'startDate', 'endDate']
        };
        const bookings = await Booking.findAll(op);
        const formattedBookings = bookings.map((booking)=>{
            const bookingJson = booking.toJSON();
            if(bookingJson.Spot){
                bookingJson.User = bookingJson.Spot.User;
            }
            return {
                spotId:bookingJson.spotId,
                startDate:bookingJson.startDate,
                endDate:bookingJson.endDate
            }
        })
        res.json({ Bookings: formattedBookings});
        }
    }
    });
// * Get all Bookings for a Spot based on the Spot's id


// * Create a Booking from a Spot based on the Spot's id
// async function checkBookigConflict(spotId, startDate, endDate) {
//     const conflicts = await Booking.findAll({
//         where: {
//             spotId,
//             [Op.or]: [
//                 {
//                     startDate: {
//                         [Op.between]: [startDate, endDate]
//                     }
//                 },
//                 {
//                     endDate: {
//                         [Op.between]: [startDate, endDate]
//                     }
//                 }
//             ]
//         }
//     });
//     return conflicts;
// }


router.post('/:spotId/bookings', requireAuth, CreateBookingsAuth,validateBooking, async (req, res) => {
    // console.log('1');
    // console.log(res.spot.ownerId);
    ///
    if (req.user.id === req.spot.ownerId) {
        // console.log("1")
        requireProperAuth(res);
     }else{
        const { startDate, endDate } = req.body;
        // console.log("1")
        ///
//         const conflicts = await checkBookigConflict(req.params.spotId, startDate, endDate)
//         if(conflicts){
//             return res.status(403).json({
//                 "message": "Sorry, this spot is already booked for the specified dates",
//                 "errors": {
//     "startDate": "Start date conflicts with an existing booking",
//     "endDate": "End date conflicts with an existing booking"
//   }
//             })
//         }
        const newBooking = await Booking.create({
            userId: req.user.id,
            spotId: req.params.spotId,
            startDate,
            endDate
        });
        res.status(200).json(newBooking);
    }
});


// * Create a Booking from a Spot based on the Spot's id

module.exports = router;
