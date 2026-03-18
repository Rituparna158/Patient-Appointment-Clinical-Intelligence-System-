'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('permissions', ['name'], {
      unique: true,
      name: 'idx_permissions_name',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('permissions', 'idx_permissions_name');
  },
};
