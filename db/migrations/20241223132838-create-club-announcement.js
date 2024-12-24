'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Club_announcements', {
      Can_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Can_type: {
        type: Sequelize.ENUM('一般公告','活動調整','緊急'),
        allowNull:false
      },
      Can_title: {
        type: Sequelize.STRING(20),
        allowNull:false
      },
      Can_content: {
        type: Sequelize.TEXT,
        allowNull:false
      },
      Can_attachment: {
        type: Sequelize.STRING
      },
      Can_image: {
        type: Sequelize.STRING
      },
      Can_created_at: {
        type: Sequelize.DATE,
        allowNull:false
      },
      C_id: {
        type: Sequelize.BIGINT,
        allowNull:false,
        references:{
          model:'Clubs',
          key:'C_id'
        }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Club_announcements');
  }
};