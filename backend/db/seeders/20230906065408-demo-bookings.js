'use strict';

// /** @type {import('sequelize-cli').Migration} */
const {Booking} = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
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

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
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
