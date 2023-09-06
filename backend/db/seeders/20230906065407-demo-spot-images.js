'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up:async (queryInterface, Sequelize)=> {
    await queryInterface.bulkInsert('SpotImages',[
      {
        spotId:1,
        url:'spot-1-image-1.webp',
        preview:false
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

  down:async (queryInterface, Sequelize)=> {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('SpotImages',{
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
