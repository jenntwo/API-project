'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up:async (queryInterface, Sequelize) =>{
    return queryInterface.bulkInsert('Reviews',[
      {
        userId:4,
        spotId:4,
        review:'Wonderful place! I had a great time staying here.',
        stars:5,
      },
      {
        userId:4,
        spotId:5,
        review:'The location was perfect, but the cleanliness could be improved.',
        stars:4,
      },
      {
        userId:5,
        spotId:4,
        review:'Not a great experience. The host was unresponsive.',
        stars:2,
      },
      {
        userId:6,
        spotId:4,
        review:'Amazing stay! I would highly recommend it to anyone.',
        stars:5,
      },
      {
        userId:7,
        spotId:5,
        review:'A cozy place with a beautiful view. I loved my stay!',
        stars:5,
      },
      {
        userId:8,
        spotId:6,
        review:'The host was very accommodating, and the location was convenient.',
        stars:4,
      },
      {
        userId:8,
        spotId:7,
        review:'Average experience. It met my basic needs but didn\'t exceed expectations.',
        stars:3,
      },
      {
        userId:9,
        spotId:7,
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

  down:async(queryInterface, Sequelize)=>{
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Reviews',{
      userId:{[Op.in]:[4,5,6,7,8]}
    },{});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
