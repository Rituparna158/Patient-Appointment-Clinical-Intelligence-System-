'use strict';

const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: uuid(),
        full_name: 'System Admin',
        email: 'admin@gmail.com',
        phone: '9999999999',
        gender: 'male',
        date_of_birth: new Date('1990-01-01'),
        passwordHash: passwordHash,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@gmail.com' }, {});
  },
};
