'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('analytics_daily_metrics', ['date'], {
      name: 'idx_analytics_date',
    });

    await queryInterface.addIndex('analytics_daily_metrics', ['doctorId'], {
      name: 'idx_analytics_doctor',
    });

    await queryInterface.addIndex(
      'analytics_daily_metrics',
      ['doctorId', 'date'],
      {
        name: 'idx_analytics_doctor_date',
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'analytics_daily_metrics',
      'idx_analytics_date'
    );
    await queryInterface.removeIndex(
      'analytics_daily_metrics',
      'idx_analytics_doctor'
    );
    await queryInterface.removeIndex(
      'analytics_daily_metrics',
      'idx_analytics_doctor_date'
    );
  },
};
