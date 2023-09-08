const express = require('express');
const { Op } = require('sequelize');
const { check, query } = require('express-validator');
const { requireAuth,requireProperAuth,successfulDeleteRes } = require('../../utils/auth');
const { validationResult } = require('express-validator');

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
            .withMessage('Price is required')
    ];


//middleware for getting new json Spot info
async function getSpots(req,res){
//     //pagination
//     // const options = {
//     //     limit: size ? parseInt(size) : 10,
//     //     offset: page ? (parseInt(page) - 1) * size : 0,
//     // };
    const { page = 1, size = 10 } = req.query;
    const offset = (page - 1) * size;

    const spots = await Spot.findAll({
        limit:parseInt(size),
        offset,
        include:[
            {
                model:Review,
                attributes:['stars']
            },
            {
                model:SpotImage,
                attributes:['url']
            }
        ]
        });

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
router.get('/', async (req, res) => {
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        //update spot
        const editedSpot = await req.spot.update({...req.body})
        res.status(200).json(editedSpot);
  });
//* Edit a spot



//* Delete a spot
router.delete('/:spotId', requireAuth,isSpotOwner,successfulDeleteRes, async(req, res) => {
    const spot = req.spot;
    await req.spot.destroy();
    successfulDeleteRes(res);
  });


module.exports = router;
