'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('roles', ['name'], {
      unique: true,
      name: 'idx_roles_name',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('roles', 'idx_roles_name');
  },
};
