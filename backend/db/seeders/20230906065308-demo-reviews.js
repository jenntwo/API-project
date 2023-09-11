'use strict';

const {Review} = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId:1,
        spotId:1,
        review:'Wonderful place! I had a great time staying here.',
        stars:5,
      },
      {
        userId:1,
        spotId:1,
        review:'The location was perfect, but the cleanliness could be improved.',
        stars:4,
      },
      {
        userId:2,
        spotId:2,
        review:'Not a great experience. The host was unresponsive.',
        stars:2,
      },
      {
        userId:3,
        spotId:4,
        review:'Amazing stay! I would highly recommend it to anyone.',
        stars:5,
      },
      {
        userId:3,
        spotId:3,
        review:'A cozy place with a beautiful view. I loved my stay!',
        stars:5,
      },
      {
        userId:3,
        spotId:3,
        review:'The host was very accommodating, and the location was convenient.',
        stars:4,
      },
      {
        userId:2,
        spotId:3,
        review:'Average experience. It met my basic needs but didn\'t exceed expectations.',
        stars:3,
      },
      {
        userId:1,
        spotId:4,
        review:'The place was not as described in the listing. I was disappointed.',
        stars:2,
      },
      {
        userId: 4,
        spotId: 5,
        review: 'Great experience overall! The host was friendly and helpful.',
        stars: 5,
      },
      {
        userId: 4,
        spotId: 6,
        review: 'The place was clean and comfortable. I would stay here again.',
        stars: 4,
      },
      {
        userId: 5,
        spotId: 7,
        review: 'Excellent stay! The property had everything I needed.',
        stars: 5,
      },
      {
        userId: 5,
        spotId: 7,
        review: 'The location was fantastic, close to many attractions.',
        stars: 4,
      },
      {
        userId: 6,
        spotId: 8,
        review: 'Disappointing experience. The amenities were lacking.',
        stars: 2,
      },
      {
        userId: 6,
        spotId: 9,
        review: 'The host was unresponsive to my messages.',
        stars: 1,
      },
      {
        userId: 7,
        spotId: 10,
        review: 'I had a peaceful stay with beautiful views.',
        stars: 4,
      },
      {
        userId: 7,
        spotId: 11,
        review: 'The property was well-maintained and clean.',
        stars: 5,
      },
      {
        userId: 8,
        spotId: 12,
        review: 'A comfortable place to relax and unwind.',
        stars: 4,
      },
      {
        userId: 8,
        spotId: 13,
        review: 'The host went above and beyond to make my stay enjoyable.',
        stars: 5,
      }, {
        userId: 9,
        spotId: 14,
        review: 'The property had a great view of the city.',
        stars: 4,
      },
      {
        userId: 9,
        spotId: 15,
        review: 'I had a relaxing stay in this quiet neighborhood.',
        stars: 5,
      },
      {
        userId: 10,
        spotId: 16,
        review: 'The place exceeded my expectations. Highly recommended!',
        stars: 5,
      },
      {
        userId: 10,
        spotId: 17,
        review: 'The host was very friendly and accommodating.',
        stars: 5,
      },
      {
        userId: 10,
        spotId: 18,
        review: 'Average stay. The property could use some improvements.',
        stars: 3,
      },
      {
        userId: 10,
        spotId: 19,
        review: 'Great location with easy access to public transportation.',
        stars: 4,
      },
      {
        userId: 10,
        spotId: 20,
        review: 'The place was clean, but the furnishings were outdated.',
        stars: 3,
      },
      {
        userId: 10,
        spotId: 21,
        review: 'Overall, a pleasant experience. I enjoyed my stay.',
        stars: 4,
      }
    ],{});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId:{[Op.in]:[1,2,3,4,5,6,7,8,9,10]}
    },{});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
