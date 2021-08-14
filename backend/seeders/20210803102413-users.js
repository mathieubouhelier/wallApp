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
          user_password: '$2b$10$4wEADY7nVCL015N.eQn4y.sNaZPHoHV37e3QLZyNw4m84XzU0oVnW',
        },
        {
          id: 3,
          user_name: 'user3',
          email: 'user3@gmail.com',
          user_password: '$2b$10$4wEADY7nVCL015N.eQn4y.sNaZPHoHV37e3QLZyNw4m84XzU0oVnW',
        }
      ],
      { timestamps: false },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
