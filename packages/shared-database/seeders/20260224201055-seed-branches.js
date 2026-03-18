'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('branches', [
      {
        id: uuid(),
        name: 'Main Clinic',
        address: 'Bhubaneswar',
        phone: '9999999999',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('branches', null, {});
  },
};
