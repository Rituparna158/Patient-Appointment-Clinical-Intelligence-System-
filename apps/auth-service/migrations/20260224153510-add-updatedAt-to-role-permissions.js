'use strict';

const { toDefaultValue } = require('sequelize/lib/utils');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('role_permissions', 'updatedAt', {
      type: Sequelize.DATE,
      //allowNull:false,
      toDefaultValue: Sequelize.NOW,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('role_permissions', 'updatedAt');
  },
};
