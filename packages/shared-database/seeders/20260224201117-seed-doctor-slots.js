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

    const slotDate = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD

    const slots = [
      {
        id: uuid(),
        doctorId,
        branchId,
        slotDate,

        startTime: new Date(`${slotDate}T10:00:00.000Z`),
        endTime: new Date(`${slotDate}T10:30:00.000Z`),

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

        startTime: new Date(`${slotDate}T10:30:00.000Z`),
        endTime: new Date(`${slotDate}T11:00:00.000Z`),

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

        startTime: new Date(`${slotDate}T11:00:00.000Z`),
        endTime: new Date(`${slotDate}T11:30:00.000Z`),

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
