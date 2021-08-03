'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 1,
          user_name: 'user1',
          email: 'user1@gmail.com',
          user_password: '123',
        },
        {
          id: 2,
          user_name: 'John Doe',
          email: 'johndoe@gmail.com',
          user_password: '123456',
        },
      ],
      { timestamps: false },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
