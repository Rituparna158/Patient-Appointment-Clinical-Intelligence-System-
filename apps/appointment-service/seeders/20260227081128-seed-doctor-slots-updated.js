'use strict';

const { v4: uuid } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const [doctors] = await queryInterface.sequelize.query(
      `SELECT id FROM doctors LIMIT 1`
    );

    const [branches] = await queryInterface.sequelize.query(
      `SELECT id FROM branches LIMIT 1`
    );

    if (!doctors.length || !branches.length) {
      throw new Error('Doctor or Branch not found. Seed them first.');
    }

    const doctorId = doctors[0].id;
    const branchId = branches[0].id;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const slotDate = tomorrow.toISOString().split('T')[0];

    const slots = [
      {
        id: uuid(),
        doctorId,
        branchId,
        slotDate,

        startTime: '10:00:00',
        endTime: '10:30:00',

        isBooked: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        doctorId,
        branchId,
        slotDate,

        startTime: '10:30:00',
        endTime: '11:00:00',

        isBooked: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        doctorId,
        branchId,
        slotDate,

        startTime: '11:00:00',
        endTime: '11:30:00',

        isBooked: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('doctor_slots', slots);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('doctor_slots', null, {});
  },
};
