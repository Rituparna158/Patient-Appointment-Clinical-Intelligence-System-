'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('appointments', ['doctorId'], {
      name: 'idx_appointments_doctor',
    });

    await queryInterface.addIndex('appointments', ['patientId'], {
      name: 'idx_appointments_patient',
    });

    await queryInterface.addIndex('appointments', ['slotId'], {
      name: 'idx_appointments_slot',
    });

    await queryInterface.addIndex('appointments', ['status'], {
      name: 'idx_appointments_status',
    });

    await queryInterface.addIndex('appointments', ['doctorId', 'createdAt'], {
      name: 'idx_appointments_doctor_created',
    });

    await queryInterface.addIndex('appointments', ['patientId', 'createdAt'], {
      name: 'idx_appointments_patient_created',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('appointments', 'idx_appointments_doctor');
    await queryInterface.removeIndex(
      'appointments',
      'idx_appointments_patient'
    );
    await queryInterface.removeIndex('appointments', 'idx_appointments_slot');
    await queryInterface.removeIndex('appointments', 'idx_appointments_status');
    await queryInterface.removeIndex(
      'appointments',
      'idx_appointments_doctor_created'
    );
    await queryInterface.removeIndex(
      'appointments',
      'idx_appointments_patient_created'
    );
  },
};
