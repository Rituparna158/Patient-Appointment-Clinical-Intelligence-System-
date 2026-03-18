'use strict';
const { v4: uuid } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id,name FROM roles`
    );
    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id,name FROM permissions`
    );

    const roleMap = {};
    roles.forEach((r) => (roleMap[r.name] = r.id));

    const perMap = {};
    permissions.forEach((p) => (perMap[p.name] = p.id));

    await queryInterface.bulkInsert('role_permissions', [
      {
        id: uuid(),
        roleId: roleMap.admin,
        permissionId: perMap['create_doctors'],
        createdAt: new Date(),
      },
      {
        id: uuid(),
        roleId: roleMap.admin,
        permissionId: perMap['manage_users'],
        createdAt: new Date(),
      },
      {
        id: uuid(),
        roleId: roleMap.admin,
        permissionId: perMap['manage_appointments'],
        createdAt: new Date(),
      },
      {
        id: uuid(),
        roleId: roleMap.admin,
        permissionId: perMap['view_appointments'],
        createdAt: new Date(),
      },

      {
        id: uuid(),
        roleId: roleMap.doctor,
        permissionId: perMap['view_appointments'],
        createdAt: new Date(),
      },
      {
        id: uuid(),
        roleId: roleMap.patient,
        permissionId: perMap['view_appointments'],
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  },
};
