'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('doctor_slots', 'startTime', {
      type: Sequelize.TIME,
      allowNull: false,
    });

    await queryInterface.changeColumn('doctor_slots', 'endTime', {
      type: Sequelize.TIME,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('doctor_slots', 'startTime', {
      type: Sequelize.DATE,
    });

    await queryInterface.changeColumn('doctor_slots', 'endTime', {
      type: Sequelize.DATE,
    });
  },
};
