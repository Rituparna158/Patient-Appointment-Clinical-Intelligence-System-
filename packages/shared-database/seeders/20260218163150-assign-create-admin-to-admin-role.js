'use strict';
const e = require('express');
const { v4: uuid } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id,name FROM roles WHERE name='admin'`
    );
    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id,name FROM permissions WHERE name='create_admin'`
    );
    if (!roles.length || !permissions.length) {
      throw new Error('Admin role or create admin permission does not found');
    }

    const adminRoleId = roles[0].id;
    const permissionId = permissions[0].id;
    await queryInterface.bulkInsert('role_permissions', [
      {
        id: uuid(),
        roleId: adminRoleId,
        permissionId: permissionId,
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, { where: {} });
  },
};
