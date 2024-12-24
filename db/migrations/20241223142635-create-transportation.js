'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transportation', {
      Ts_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Ts_method: {
        type: Sequelize.ENUM('自行出發','需協助安排','可協助載人','需借用安全帽'),
        allowNull:false
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transportation');
  }
};