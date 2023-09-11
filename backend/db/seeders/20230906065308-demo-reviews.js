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
      userId:{[Op.in]:[1,2,3]}
    },{});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
