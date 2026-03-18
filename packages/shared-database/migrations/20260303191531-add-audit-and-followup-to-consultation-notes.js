'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('consultation_notes', 'createdBy', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.addColumn('consultation_notes', 'updatedBy', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.addColumn('consultation_notes', 'lockedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('consultation_notes', 'followUpDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('consultation_notes', 'createdBy');
    await queryInterface.removeColumn('consultation_notes', 'updatedBy');
    await queryInterface.removeColumn('consultation_notes', 'lockedAt');
    await queryInterface.removeColumn('consultation_notes', 'followUpDate');
  },
};
