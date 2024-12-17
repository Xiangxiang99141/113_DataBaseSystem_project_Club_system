'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Club_activities', {
      Ca_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Ca_name: {
        type: Sequelize.STRING(15)
      },
      Ca_content: {
        type: Sequelize.STRING(150)
      },
      Ca_location: {
        type: Sequelize.STRING(30)
      },
      Ca_date: {
        type: Sequelize.DATE
      },
      Ca_quota: {
        type: Sequelize.INTEGER
      },
      Ca_open_at: {
        type: Sequelize.DATE
      },
      Ca_close_at: {
        type: Sequelize.DATE
      },
      insurance: {
        type: Sequelize.BOOLEAN
      },
      transportation: {
        type: Sequelize.BOOLEAN
      },
      Ca_plan: {
        type: Sequelize.STRING
      },
      C_id: {
        type: Sequelize.BIGINT,
        references:{
          model:"Clubs",
          key:"C_id"
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Club_activities');
  }
};