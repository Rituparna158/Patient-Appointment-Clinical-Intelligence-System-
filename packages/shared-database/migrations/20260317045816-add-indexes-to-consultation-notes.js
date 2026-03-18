'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('consultation_notes', ['appointmentId'], {
      name: 'idx_notes_appointment',
    });

    await queryInterface.addIndex('consultation_notes', ['createdBy'], {
      name: 'idx_notes_created_by',
    });

    await queryInterface.addIndex('consultation_notes', ['followUpDate'], {
      name: 'idx_notes_followup',
    });

    await queryInterface.addIndex('consultation_notes', ['createdAt'], {
      name: 'idx_notes_created',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'consultation_notes',
      'idx_notes_appointment'
    );
    await queryInterface.removeIndex(
      'consultation_notes',
      'idx_notes_created_by'
    );
    await queryInterface.removeIndex(
      'consultation_notes',
      'idx_notes_followup'
    );
    await queryInterface.removeIndex('consultation_notes', 'idx_notes_created');
  },
};
