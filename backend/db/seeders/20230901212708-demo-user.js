'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName:'Momo',
        lastName:'Dede',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        firstName:'User1',
        lastName:'Fake1',
        hashedPassword: bcrypt.hashSync('password2')
      },

      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName:'User2',
        lastName:'Fake2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user3@user.io',
        username: 'FakeUser3',
        firstName: 'User3',
        lastName: 'Fake3',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: 'user4@user.io',
        username: 'FakeUser4',
        firstName: 'User4',
        lastName: 'Fake4',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        email: 'user5@user.io',
        username: 'FakeUser5',
        firstName: 'User5',
        lastName: 'Fake5',
        hashedPassword: bcrypt.hashSync('password6')
      },

      {
        email: 'user6@user.io',
        username: 'FakeUser6',
        firstName: 'User6',
        lastName: 'Fake6',
        hashedPassword: bcrypt.hashSync('password7')
      },
      {
        email: 'user7@user.io',
        username: 'FakeUser7',
        firstName: 'User7',
        lastName: 'Fake7',
        hashedPassword: bcrypt.hashSync('password8')
      },
      {
        email: 'user8@user.io',
        username: 'FakeUser8',
        firstName: 'User8',
        lastName: 'Fake8',
        hashedPassword: bcrypt.hashSync('password9')
      },
      {
        email: 'user9@user.io',
        username: 'FakeUser9',
        firstName: 'User9',
        lastName: 'Fake9',
        hashedPassword: bcrypt.hashSync('password10')
      }
    ], { validate: true });
  },


  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition',
      'FakeUser1',
      'FakeUser2',
      'FakeUser3',
      'FakeUser4',
      'FakeUser5',
      'FakeUser6',
      'FakeUser7',
      'FakeUser8',
      'FakeUser9'] }
    }, {});
  }
};
