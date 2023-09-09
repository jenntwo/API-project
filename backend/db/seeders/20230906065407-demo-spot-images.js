'use strict';

const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId:1,
        url:'spot-1-image-1.webp',
        preview:true
      },
      {
        spotId: 1,
        url: 'spot-1-image-2.webp',
        preview: true
      },
      {
        spotId: 2,
        url: 'spot-2-image-1.webp',
        preview: false
      },
      {
        spotId: 2,
        url: 'spot-2-image-2.webp',
        preview: true
      },
      {
        spotId: 2,
        url: 'spot-2-image-3.webp',
        preview: false
      },
      {
        spotId: 3,
        url: 'spot-3-image-1.webp',
        preview: true
      },
      {
        spotId: 3,
        url: 'spot-3-image-2.webp',
        preview: false
      }
    ],{})
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId:{[Op.in]:[1,2,3]}
    },{});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
