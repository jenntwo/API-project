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
      },
      {
        ownerId: 4,
        address: '111 Oakwood Ln',
        city: 'Testville',
        state: 'TX',
        country: 'USA',
        lat: 30.12345,
        lng: -97.98765,
        name: 'Quaint Bungalow',
        description: 'A charming bungalow in a quiet neighborhood.',
        price: 120.00
      },
      {
        ownerId: 4,
        address: '222 Willow St',
        city: 'Sampletown',
        state: 'NY',
        country: 'USA',
        lat: 40.67890,
        lng: -73.12345,
        name: 'Downtown Loft',
        description: 'A trendy loft in the heart of the city.',
        price: 175.00
      },
      {
        ownerId: 5,
        address: '333 Pinecone Rd',
        city: 'Demoville',
        state: 'CA',
        country: 'USA',
        lat: 37.87654,
        lng: -121.34567,
        name: 'Secluded Retreat',
        description: 'A secluded retreat surrounded by nature.',
        price: 90.00
      },
      {
        ownerId: 6,
        address: '444 Willow Ln',
        city: 'Exampletown',
        state: 'CA',
        country: 'USA',
        lat: 36.78901,
        lng: -121.98765,
        name: 'Cozy Cabin Retreat',
        description: 'A rustic cabin retreat nestled in the woods.',
        price: 95.00
      },
      {
        ownerId: 6,
        address: '555 Cedar Rd',
        city: 'Testington',
        state: 'TX',
        country: 'USA',
        lat: 30.87654,
        lng: -97.54321,
        name: 'Downtown Condo',
        description: 'A modern condo in the heart of the city.',
        price: 160.00
      },
      {
        ownerId: 7,
        address: '666 Oakwood Ave',
        city: 'Sampleville',
        state: 'NY',
        country: 'USA',
        lat: 40.12345,
        lng: -74.67890,
        name: 'Lakefront Cottage',
        description: 'A charming cottage on the shores of a serene lake.',
        price: 130.00
      },
      {
        ownerId: 7,
        address: '777 Elm St',
        city: 'Demo City',
        state: 'FL',
        country: 'USA',
        lat: 26.43210,
        lng: -81.87654,
        name: 'Luxury Villa',
        description: 'A luxurious villa with a private pool.',
        price: 350.00
      },
      {
        ownerId: 8,
        address: '888 Pine St',
        city: 'Modeltown',
        state: 'CA',
        country: 'USA',
        lat: 37.98765,
        lng: -122.34567,
        name: 'Mountain Chalet',
        description: 'A cozy chalet with stunning mountain views.',
        price: 110.00
      },
      {
        ownerId: 8,
        address: '999 Birch Ave',
        city: 'Testville',
        state: 'IL',
        country: 'USA',
        lat: 41.23456,
        lng: -87.56789,
        name: 'Urban Penthouse',
        description: 'An urban penthouse with a rooftop terrace.',
        price: 200.00
      },
      {
        ownerId: 9,
        address: '1010 Cedar Ln',
        city: 'Sampletown',
        state: 'WA',
        country: 'USA',
        lat: 48.76543,
        lng: -123.87654,
        name: 'Countryside Retreat',
        description: 'A peaceful retreat in the countryside.',
        price: 120.00
      },
      {
        ownerId: 9,
        address: '1111 Elm Ave',
        city: 'Demoville',
        state: 'TX',
        country: 'USA',
        lat: 30.54321,
        lng: -97.23456,
        name: 'Modern Townhouse',
        description: 'A modern townhouse with all the amenities.',
        price: 175.00
      },
      {
        ownerId: 10,
        address: '1212 Oakwood Rd',
        city: 'Exampletown',
        state: 'CA',
        country: 'USA',
        lat: 36.12345,
        lng: -121.98765,
        name: 'Treehouse Getaway',
        description: 'A unique treehouse for a memorable stay.',
        price: 85.00
      },
      {
        ownerId: 10,
        address: '1313 Willow Ave',
        city: 'Testington',
        state: 'NY',
        country: 'USA',
        lat: 40.87654,
        lng: -74.12345,
        name: 'Downtown Loft',
        description: 'A trendy loft in the heart of the city.',
        price: 160.00
      },
      {
        ownerId: 10,
        address: '2222 Elm Street',
        city: 'Sampletown',
        state: 'CA',
        country: 'USA',
        lat: 34.56789,
        lng: -118.98765,
        name: 'Cozy Studio',
        description: 'A comfortable studio apartment in a quiet neighborhood.',
        price: 80.00
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
      ownerId:{[Op.in]:[1,2,3,4,5,6,7,8,9,10]}
    },{});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
