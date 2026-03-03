'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('consultation_notes', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      appointmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'appointments',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      symptoms: { type: Sequelize.TEXT, allowNull: false },
      diagnosis: { type: Sequelize.TEXT, allowNull: false },
      prescriptions: { type: Sequelize.TEXT, allowNull: false },
      notes: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('consultation_notes');
  },
};
