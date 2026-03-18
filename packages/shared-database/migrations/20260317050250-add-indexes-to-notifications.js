'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('notifications', ['userId'], {
      name: 'idx_notifications_user',
    });

    await queryInterface.addIndex('notifications', ['status', 'scheduledAt'], {
      name: 'idx_notifications_status_schedule',
    });

    await queryInterface.addIndex('notifications', ['createdAt'], {
      name: 'idx_notifications_created',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('notifications', 'idx_notifications_user');
    await queryInterface.removeIndex(
      'notifications',
      'idx_notifications_status_schedule'
    );
    await queryInterface.removeIndex(
      'notifications',
      'idx_notifications_created'
    );
  },
};
