module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('analytics_daily_metrics', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      branchId: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      doctorId: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      totalAppointments: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      confirmedAppointments: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      cancelledAppointments: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      missedAppointments: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      completedAppointments: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      totalRevenue: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      avgConsultationFee: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      newPatients: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      uniquePatients: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      followUpsScheduled: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('analytics_daily_metrics', {
      fields: ['date', 'branchId', 'doctorId'],
      type: 'unique',
      name: 'unique_daily_metrics',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('analytics_daily_metrics');
  },
};
