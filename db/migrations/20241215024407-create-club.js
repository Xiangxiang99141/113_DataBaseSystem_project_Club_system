'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clubs', {
      C_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      C_name: {
        type: Sequelize.STRING(10),
        allowNull:false
      },
      C_type: {
        type: Sequelize.ENUM('服務性','學藝性','體能性','自治性','康樂性'),
        allowNull:false
      },
      C_intro: {
        type: Sequelize.STRING(50),
        allowNull:false
      },
      C_web: {
        type: Sequelize.STRING,
      },
      C_quota: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      C_close: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      C_created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      C_update_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Clubs');
  }
};