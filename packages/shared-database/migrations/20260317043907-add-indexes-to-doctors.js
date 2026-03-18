'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('doctors', ['userId', 'is_active'], {
      name: 'idx_doctor_user_active',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('doctors', 'idx_doctor_user_active');
  },
};
