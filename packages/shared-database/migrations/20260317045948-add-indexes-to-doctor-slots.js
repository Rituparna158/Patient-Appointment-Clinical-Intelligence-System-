'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex(
      'doctor_slots',
      ['doctorId', 'slotDate', 'isBooked'],
      {
        name: 'idx_slots_doctor_date_booked',
      }
    );

    await queryInterface.addIndex('doctor_slots', ['slotDate'], {
      name: 'idx_slots_date',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'doctor_slots',
      'idx_slots_doctor_date_booked'
    );
    await queryInterface.removeIndex('doctor_slots', 'idx_slots_date');
  },
};
