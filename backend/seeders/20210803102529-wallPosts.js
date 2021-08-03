'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Posts', [
      {
        id: 1,
        title: 'First Post',
        content: 'starting posting on the Wall',
        userId: 1,
        published: new Date('2021-08-01T19:58:00.000Z'),
        updated: new Date('2021-08-01T19:58:51.000Z'),
      },
      {
        id: 2,
        title: 'The 2nd one',
        content: 'continuing posting',
        userId: 1,
        published: new Date('2021-08-02T19:58:00.000Z'),
        updated: new Date('2021-08-02T19:58:51.000Z'),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Posts', null, {});
  }
};
