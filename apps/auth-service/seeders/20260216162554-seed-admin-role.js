'use strict';

const { v4: uuid } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [[admin]] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email='admin@gmail.com' LIMIT 1`
    );
    const [[role]] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name='admin' AND is_active=true LIMIT 1`
    );

    if (!admin || !role) {
      throw new Error('Admin user or admin role not found');
    }
    await queryInterface.bulkInsert('user_roles', [
      {
        id: uuid(),
        userId: admin.id,
        roleId: role.id,
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user_roles', null, {});
  },
};
