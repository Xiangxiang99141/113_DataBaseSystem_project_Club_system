'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Members', {
      M_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      M_account: {
        type: Sequelize.STRING(20),
        allowNull:false
      },
      M_name: {
        type: Sequelize.STRING(30),
        allowNull:false
      },
      M_pwd: {
        type: Sequelize.STRING,
        allowNull:false
      },
      M_phone: {
        type: Sequelize.STRING(12)
      },
      email: {
        type: Sequelize.STRING
      },
      M_register_at: {
        type: Sequelize.DATE,
        allowNull:false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Members');
  }
};