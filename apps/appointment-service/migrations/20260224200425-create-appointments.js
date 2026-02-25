'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      patientId: { type: Sequelize.UUID, allowNull: false },
      doctorId: { type: Sequelize.UUID, allowNull: false },
      branchId: { type: Sequelize.UUID, allowNull: false },
      slotId: { type: Sequelize.UUID, allowNull: false },
      status: {
        type: Sequelize.ENUM(
          'requested',
          'confirmed',
          'completed',
          'missed',
          'cancelled'
        ),
        defaultValue: 'requested',
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending',
      },
      appointmentReason: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('appointments');
  },
};
