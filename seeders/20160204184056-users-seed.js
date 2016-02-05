'use strict';
var faker = require ('faker');

module.exports = {
  up: function (queryInterface, Sequelize) {
    var users = [];

    for (var i = 0; i < 5; i++) {
      users.push({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(users.length);
    return queryInterface.bulkInsert('Users', users, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
