'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up:async (queryInterface, Sequelize) =>{
    await queryInterface.bulkInsert('ReviewImages',[
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
        reviewId:3,
        url:'review-3-Image-2.com'
      }
    ],{})
  },

  down:async (queryInterface, Sequelize)=>{
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('ReviewImages',{
      reviewId:{[Op.in]:[1, 2, 3]}
    },{})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
