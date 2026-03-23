'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('patients', ['userId'], {
      name: 'idx_patient_user',
    });

    await queryInterface.addIndex('patients', ['createdAt'], {
      name: 'idx_patient_created_at',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('patients', 'idx_patient_user');
    await queryInterface.removeIndex('patients', 'idx_patient_created_at');
  },
};
