'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE doctor_slots
      ALTER COLUMN "startTime"
      TYPE TIMESTAMP WITH TIME ZONE
      USING (CURRENT_DATE + "startTime");
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE doctor_slots
      ALTER COLUMN "endTime"
      TYPE TIMESTAMP WITH TIME ZONE
      USING (CURRENT_DATE + "endTime");
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE doctor_slots
      ALTER COLUMN "startTime"
      TYPE TIME WITHOUT TIME ZONE
      USING ("startTime"::time);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE doctor_slots
      ALTER COLUMN "endTime"
      TYPE TIME WITHOUT TIME ZONE
      USING ("endTime"::time);
    `);
  },
};
