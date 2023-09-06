'use strict';

// /** @type {import('sequelize-cli').Migration} */
const {Booking, Sequelize} = require('../models');

module.exports = {
up:async (queryInterface, Sequelize)=> {
  await queryInterface.bulkInsert('Bookings',[
    {
      spotId:1,
      userId:1,
      startDate:'2023-01-03',
      endDate:'2023-01-05'
    },
    {
      spotId:1,
      userId:2,
      startDate:'2023-05-19',
      endDate:'2023-06-19'
    },
    {
      spotId:2,
      userId:2,
      startDate:'2023-03-02',
      endDate:'2023-03-03'
    },
    {
      spotId:3,
      userId:3,
      startDate:'2023-10-02',
      endDate:'2023-10-04'
    }
  ],{});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Bookings', {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
