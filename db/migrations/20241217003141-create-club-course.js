'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Club_courses', {
      Cc_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Cc_name: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      Cc_content: {
        type: Sequelize.STRING(150),
        allowNull:false
      },
      Cc_location: {
        type: Sequelize.STRING(30),
        allowNull:false
      },
      Cc_date: {
        type: Sequelize.DATE,
        allowNull:false
      },
      Cc_quota: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      Cc_open_at: {
        type: Sequelize.DATE,
        allowNull:false
      },
      Cc_close_at: {
        type: Sequelize.DATE,
        allowNull:false
      },
      insurance: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      transportation: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      C_id: {
        type: Sequelize.BIGINT,
        allowNull:false,
        references:{
          model:"Clubs",
          key:"C_id"
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Club_courses');
  }
};