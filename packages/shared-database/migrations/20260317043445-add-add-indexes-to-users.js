'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'idx_users_email',
    });

    await queryInterface.addIndex('users', ['full_name'], {
      name: 'idx_users_full_name',
    });

    await queryInterface.addIndex('users', ['createdAt'], {
      name: 'idx_users_created_at',
    });

    await queryInterface.addIndex('users', ['isActive'], {
      name: 'idx_users_active',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('users', 'idx_users_email');
    await queryInterface.removeIndex('users', 'idx_users_full_name');
    await queryInterface.removeIndex('users', 'idx_users_created_at');
    await queryInterface.removeIndex('users', 'idx_users_active');
  },
};
