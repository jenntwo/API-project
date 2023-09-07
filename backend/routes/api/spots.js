const express = require('express');
const { Op } = require('sequelize');
const { check, query } = require('express-validator');
const { requireAuth } = require('../../utils/auth');

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


// //Get detailed of a Spot from an id
// router.get('/:spotId',(req,res)=>{
//     const spotId = parseInt(req.params.spotId);
//     const spot = spots.find((spot) => spot.id === spotId);

//     if (spot) {
//         res.status(200).json(spot);
//       } else {
//         res.status(404).json({ message: "Spot couldn't be found" });
//       }
// });

// //Create a Spot
// router.post('/', requireAuth, validateSpot, async(req,res)=>{
//     // Authentciation the user
//      // Validate the request body
//      //Create new spot
//      const newSpot = {
//         id: spots.length + 1,
//         ownerId: req.user.id,
//         ...req.body,
//       };

//       spot.push(newSpot);
//       res.status(201).json(newSpot)
// });

// //Add an Image to a Spot based on the Spot's id

// // Middleware to check if a spot belongs to the current user
// function isSpotOwner(req, res, next) {
//     // Check if the spot with spotId belongs to the current user
//     const spotId = parseInt(req.params.spotId);
//     const spot = spots.find((spot) => spot.id === spotId);

//     if (!spot){
//       return res.status(404).json({ message: "Spot couldn't be found" });
//     }else if(spot.ownerId !== currentUserId) {
//       return res.status(403).json({message:"Spot must belong to the current user"})
//   }
//   next();
// }

// router.post('/:spotId/images',validateSpot,isSpotOwner,(req,res)=>{
//     const newImage = {
//         id: spotImages.length + 1,
//         spotId: spotId,
//         ownerId: req.user.id,
//         ...req.body,
//       };
//       spotImages.push(newImage);
//       res.status(200).json(newImage);
// });


// // edit a spot
// router.put('/:spotId', validateSpot, isSpotOwner, (req, res) => {
//     //update info
//     res.status(200).json(spot);
//   });

// // delete a spot
// router.delete('/:spotId', isSpotOwner, (req, res) => {

//     //delete db
//     spots.splice(spotIndex, 1);
//     res.status(200).json({ message: "Successfully deleted" });
//   });


module.exports = router;
