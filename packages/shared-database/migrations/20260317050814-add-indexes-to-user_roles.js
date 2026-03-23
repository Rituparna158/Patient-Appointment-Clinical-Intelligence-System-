'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('user_roles', ['userId'], {
      name: 'idx_user_roles_user',
    });

    await queryInterface.addIndex('user_roles', ['roleId'], {
      name: 'idx_user_roles_role',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('user_roles', 'idx_user_roles_user');
    await queryInterface.removeIndex('user_roles', 'idx_user_roles_role');
  },
};
