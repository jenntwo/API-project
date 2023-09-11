'use strict';

const { sequelize } = require('../models');
const { ReviewImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId:1,
        url:'review-1-Image.com'
      },
      {
        reviewId:2,
        url:'review-2-Image.com'
      },
      {
        reviewId:3,
        url:'review-3-Image-1.com'
      },
      {
        reviewId:4,
        url:'review-3-Image-2.com'
      },
      {
        reviewId: 5,
        url: 'review-4-Image.com',
      },
      {
        reviewId: 6,
        url: 'review-5-Image.com',
      },
      {
        reviewId: 7,
        url: 'review-6-Image-1.com',
      },
      {
        reviewId: 7,
        url: 'review-6-Image-2.com',
      },
      {
        reviewId: 8,
        url: 'review-7-Image.com',
      },
      {
        reviewId: 9,
        url: 'review-8-Image.com',
      },
      {
        reviewId: 10,
        url: 'review-9-Image-1.com',
      },
      {
        reviewId: 10,
        url: 'review-9-Image-2.com',
      },
      {
        reviewId: 11,
        url: 'review-10-Image.com',
      },
      {
        reviewId: 12,
        url: 'review-11-Image.com',
      },
      {
        reviewId: 13,
        url: 'review-12-Image-1.com',
      },
      {
        reviewId: 13,
        url: 'review-12-Image-2.com',
      },
      {
        reviewId: 14,
        url: 'review-13-Image.com',
      },
      {
        reviewId: 15,
        url: 'review-14-Image.com',
      },
      {
        reviewId: 16,
        url: 'review-15-Image-1.com',
      },
      {
        reviewId: 16,
        url: 'review-15-Image-2.com',
      },
      {
        reviewId: 17,
        url: 'review-16-Image.com',
      },
      {
        reviewId: 18,
        url: 'review-17-Image.com',
      },
      {
        reviewId: 19,
        url: 'review-18-Image-1.com',
      },
      {
        reviewId: 19,
        url: 'review-18-Image-2.com',
      },
      {
        reviewId: 20,
        url: 'review-19-Image.com',
      },
      {
        reviewId: 21,
        url: 'review-20-Image.com',
      },
      {
        reviewId: 22,
        url: 'review-21-Image-1.com',
      },
      {
        reviewId: 22,
        url: 'review-21-Image-2.com',
      },
      {
        reviewId: 23,
        url: 'review-22-Image.com',
      },
      {
        reviewId: 24,
        url: 'review-23-Image.com',
      },
      {
        reviewId: 25,
        url: 'review-24-Image-1.com',
      },
      {
        reviewId: 25,
        url: 'review-24-Image-2.com',
      },
      {
        reviewId: 26,
        url: 'review-25-Image.com',
      }
    ],{})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId:{[Op.in]:[1, 2, 3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]}
    },{})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
