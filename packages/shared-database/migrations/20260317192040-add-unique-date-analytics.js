'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('analytics_daily_metrics', {
      fields: ['date'],
      type: 'unique',
      name: 'unique_analytics_date',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'analytics_daily_metrics',
      'unique_analytics_date'
    );
  },
};
