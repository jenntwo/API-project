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
      startDate:'2023-12-03',
      endDate:'2023-12-05'
    },
    {
      spotId:1,
      userId:3,
      startDate:'2023-09-16',
      endDate:'2023-09-28'
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
    },
    {
      spotId:3,
      userId:1,
      startDate:'2021-10-02',
      endDate:'2021-10-04'
    },
    {
      spotId:3,
      userId:1,
      startDate:'2024-10-02',
      endDate:'2024-10-04'
    },
    {
      spotId:2,
      userId:1,
      startDate:'2023-11-28',
      endDate:'2024-01-04'
    },
    {
      spotId: 4,
      userId: 4,
      startDate: '2023-12-10',
      endDate: '2023-12-15',
    },
    {
      spotId: 4,
      userId: 5,
      startDate: '2023-09-20',
      endDate: '2023-09-25',
    },
    {
      spotId: 4,
      userId: 6,
      startDate: '2023-06-05',
      endDate: '2023-06-10',
    },
    {
      spotId: 5,
      userId: 7,
      startDate: '2023-04-02',
      endDate: '2023-04-05',
    },
    {
      spotId: 5,
      userId: 8,
      startDate: '2023-10-15',
      endDate: '2023-10-20',
    },
    {
      spotId: 5,
      userId: 9,
      startDate: '2023-08-01',
      endDate: '2023-08-05',
    },
    {
      spotId: 6,
      userId: 10,
      startDate: '2024-01-10',
      endDate: '2024-01-20',
    },
    {
      spotId: 6,
      userId: 7,
      startDate: '2023-11-01',
      endDate: '2023-11-05',
    },
    {
      spotId: 7,
      userId: 8,
      startDate: '2023-12-20',
      endDate: '2023-12-27',
    },
    {
      spotId: 7,
      userId: 9,
      startDate: '2023-07-10',
      endDate: '2023-07-20',
    },
    {
      spotId: 8,
      userId: 10,
      startDate: '2023-05-03',
      endDate: '2023-05-10',
    },
    {
      spotId: 8,
      userId: 2,
      startDate: '2023-08-15',
      endDate: '2023-08-20',
    },
    {
      spotId: 9,
      userId: 3,
      startDate: '2023-06-10',
      endDate: '2023-06-15',
    },
    {
      spotId: 9,
      userId: 4,
      startDate: '2023-09-01',
      endDate: '2023-09-05',
    },
    {
      spotId: 9,
      userId: 5,
      startDate: '2023-11-15',
      endDate: '2023-11-20',
    },
    {
      spotId: 10,
      userId: 6,
      startDate: '2023-10-01',
      endDate: '2023-10-10',
    },
    {
      spotId: 10,
      userId: 7,
      startDate: '2023-12-01',
      endDate: '2023-12-05',
    },
    {
      spotId: 10,
      userId: 8,
      startDate: '2023-07-15',
      endDate: '2023-07-20',
    },
    {
      spotId: 11,
      userId: 9,
      startDate: '2023-05-20',
      endDate: '2023-05-25',
    },
    {
      spotId: 11,
      userId: 10,
      startDate: '2023-08-05',
      endDate: '2023-08-10',
    }
  ],{});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId:{[Op.in]:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]}
    }, {});
  }
};
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
