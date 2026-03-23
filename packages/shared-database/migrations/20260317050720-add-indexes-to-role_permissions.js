'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('role_permissions', ['roleId'], {
      name: 'idx_role_permissions_role',
    });

    await queryInterface.addIndex('role_permissions', ['permissionId'], {
      name: 'idx_role_permissions_permission',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'role_permissions',
      'idx_role_permissions_role'
    );
    await queryInterface.removeIndex(
      'role_permissions',
      'idx_role_permissions_permission'
    );
  },
};
