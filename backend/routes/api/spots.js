const express = require('express');
const { check, query } = require('express-validator');
const router = express.Router();
const { Op } = require('sequelize');
const { Spot, Review, SpotImages} = require('../../db/models');


async function getSpots(page,size){
    //pagination
    const options = {
        limit: size ? parseInt(size) : 10,
        offset: page ? (parseInt(page) - 1) * size : 0,
    };
    try{
         const spots = await Spot.findAll(options);

         for (let i = 0; i < spots.length; i++) {
            const spot = spots[i].toJSON();
            //get preview image
            if (spot.SpotImages.length > 0) {
                spot.previewImage = spot.SpotImages[0].url;
              } else {
                spot.previewImage = null;
              }
            //calculate the avg rating
            const reviews = await Review.findAll({ where: { spotId: spot.id } });
            if (reviews.length > 0) {
              const sum = reviews.reduce((acc, review) => acc + review.stars, 0);
              spot.avgRating = sum / Reviews.length;
            } else {
              spot.avgRating = 0;
            }
            spot[i] = spot;
        }
        return spots;
    }catch(error){
        throw error;
    }
}

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


//Get all Spots
router.get('/', async (req, res) => {
        const spots = await getSpots(req.query.page, req.query.size);
        res.status(200).json({ Spots: spots });
    });

//Get Spots owned by the Current User
router.get('/current',(req,res)=>{
//    const currentUserId =;
  const userSpots = spots.filter((spot) => spot.ownerId === currentUserId);
  res.status(200).json({ Spots: userSpots });
});

//Get detailed of a Spot from an id
router.get('/:spotId',(req,res)=>{
    const spotId = parseInt(req.params.spotId);
    const spot = spots.find((spot) => spot.id === spotId);

    if (spot) {
        res.status(200).json(spot);
      } else {
        res.status(404).json({ message: "Spot couldn't be found" });
      }
});

//Create a Spot
router.post('/', requireAuthentication, validateSpot, async(req,res)=>{
    // Authentciation the user
     // Validate the request body
     //Create new spot
     const newSpot = {
        id: spots.length + 1,
        ownerId: req.user.id,
        ...req.body,
      };

      spot.push(newSpot);
      res.status(201).json(newSpot)
});

//Add an Image to a Spot based on the Spot's id

// Middleware to check if a spot belongs to the current user
function isSpotOwner(req, res, next) {
    // Check if the spot with spotId belongs to the current user
    const spotId = parseInt(req.params.spotId);
    const spot = spots.find((spot) => spot.id === spotId);

    if (!spot){
      return res.status(404).json({ message: "Spot couldn't be found" });
    }else if(spot.ownerId !== currentUserId) {
      return res.status(403).json({message:"Spot must belong to the current user"})
  }
  next();
}

router.post('/:spotId/images',validateSpot,isSpotOwner,(req,res)=>{
    const newImage = {
        id: spotImages.length + 1,
        spotId: spotId,
        ownerId: req.user.id,
        ...req.body,
      };
      spotImages.push(newImage);
      res.status(200).json(newImage);
});


// edit a spot
router.put('/:spotId', validateSpot, isSpotOwner, (req, res) => {
    //update info
    res.status(200).json(spot);
  });

// delete a spot
router.delete('/:spotId', isSpotOwner, (req, res) => {

    //delete db
    spots.splice(spotIndex, 1);
    res.status(200).json({ message: "Successfully deleted" });
  });


    module.exports = router;
