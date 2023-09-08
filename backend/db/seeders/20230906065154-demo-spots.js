'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'Exampleville',
        state: 'CA',
        country: 'USA',
        lat: 37.12345,
        lng: -122.54321,
        name: 'Cozy Cottage',
        description: 'A charming cottage in a peaceful neighborhood.',
        price: 100.00
      },
      {
        ownerId: 1,
        address: '456 Elm St',
        city: 'Sampletown',
        state: 'NY',
        country: 'USA',
        lat: 40.67890,
        lng: -73.98765,
        name: 'Modern Apartment',
        description: 'A stylish apartment in the heart of the city.',
        price: 150.00
      },
      {
        ownerId: 2,
        address: '789 Oak St',
        city: 'Testville',
        state: 'TX',
        country: 'USA',
        lat: 30.56789,
        lng: -97.12345,
        name: 'Spacious Loft',
        description: 'A spacious loft with great views of the city.',
        price: 200.00
      },
      {
        ownerId: 2,
        address: '101 Pine St',
        city: 'Demo City',
        state: 'FL',
        country: 'USA',
        lat: 25.43210,
        lng: -80.87654,
        name: 'Beachfront Villa',
        description: 'A luxurious villa right on the beach.',
        price: 300.00
      },
      {
        ownerId: 3,
        address: '321 Cedar St',
        city: 'Modeltown',
        state: 'CA',
        country: 'USA',
        lat: 37.98765,
        lng: -121.23456,
        name: 'Rustic Cabin',
        description: 'A cozy cabin in the woods, perfect for nature lovers.',
        price: 75.00
      },
      {
        ownerId: 3,
        address: '555 Birch St',
        city: 'Testington',
        state: 'IL',
        country: 'USA',
        lat: 41.87654,
        lng: -87.34567,
        name: 'Urban Retreat',
        description: 'An urban retreat with a rooftop garden.',
        price: 180.00
      },
      {
        ownerId: 3,
        address: '222 Maple St',
        city: 'Sampleville',
        state: 'WA',
        country: 'USA',
        lat: 47.65432,
        lng: -122.34567,
        name: 'Lakeview Cabin',
        description: 'A charming cabin by the lake with stunning views.',
        price: 120.00
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId:{[Op.in]:[1,2,3,4]}
    },{});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
