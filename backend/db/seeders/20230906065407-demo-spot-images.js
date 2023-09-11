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
      },
      {
        spotId: 4,
        url: 'spot-4-image-1.webp',
        preview: true
      },
      {
        spotId: 4,
        url: 'spot-4-image-2.webp',
        preview: false
      },
      {
        spotId: 5,
        url: 'spot-5-image-1.webp',
        preview: true
      },
      {
        spotId: 5,
        url: 'spot-5-image-2.webp',
        preview: false
      },
      {
        spotId: 6,
        url: 'spot-6-image-1.webp',
        preview: true
      },
      {
        spotId: 6,
        url: 'spot-6-image-2.webp',
        preview: false
      },
      {
        spotId: 7,
        url: 'spot-7-image-1.webp',
        preview: true
      },
      {
        spotId: 7,
        url: 'spot-7-image-2.webp',
        preview: false
      },
      {
        spotId: 8,
        url: 'spot-8-image-1.webp',
        preview: true
      },
      {
        spotId: 8,
        url: 'spot-8-image-2.webp',
        preview: false
      },
      {
        spotId: 9,
        url: 'spot-9-image-1.webp',
        preview: true
      },
      {
        spotId: 9,
        url: 'spot-9-image-2.webp',
        preview: false
      },
      {
        spotId: 10,
        url: 'spot-10-image-1.webp',
        preview: true
      },
      {
        spotId: 10,
        url: 'spot-10-image-2.webp',
        preview: false
      },
      {
        spotId: 11,
        url: 'spot-11-image-1.webp',
        preview: true
      },
      {
        spotId: 11,
        url: 'spot-11-image-2.webp',
        preview: false
      },
      {
        spotId: 12,
        url: 'spot-12-image-1.webp',
        preview: true
      },
      {
        spotId: 12,
        url: 'spot-12-image-2.webp',
        preview: false
      },
      {
        spotId: 13,
        url: 'spot-13-image-1.webp',
        preview: true
      },
      {
        spotId: 13,
        url: 'spot-13-image-2.webp',
        preview: false
      },
      {
        spotId: 14,
        url: 'spot-14-image-1.webp',
        preview: true
      },
      {
        spotId: 14,
        url: 'spot-14-image-2.webp',
        preview: false
      },
      {
        spotId: 15,
        url: 'spot-15-image-1.webp',
        preview: true
      },
      {
        spotId: 15,
        url: 'spot-15-image-2.webp',
        preview: false
      },
      {
        spotId: 16,
        url: 'spot-16-image-1.webp',
        preview: true
      },
      {
        spotId: 16,
        url: 'spot-16-image-2.webp',
        preview: false
      },
      {
        spotId: 17,
        url: 'spot-17-image-1.webp',
        preview: true
      },
      {
        spotId: 17,
        url: 'spot-17-image-2.webp',
        preview: false
      },
      {
        spotId: 18,
        url: 'spot-18-image-1.webp',
        preview: true
      },
      {
        spotId: 18,
        url: 'spot-18-image-2.webp',
        preview: false
      },
      {
        spotId: 19,
        url: 'spot-19-image-1.webp',
        preview: true
      },
      {
        spotId: 19,
        url: 'spot-19-image-2.webp',
        preview: false
      },
      {
        spotId: 20,
        url: 'spot-20-image-1.webp',
        preview: true
      },
      {
        spotId: 20,
        url: 'spot-20-image-2.webp',
        preview: false
      },
      {
        spotId: 21,
        url: 'spot-21-image-1.webp',
        preview: true
      },
      {
        spotId: 21,
        url: 'spot-21-image-2.webp',
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
      spotId:{[Op.in]:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]}
    },{});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
