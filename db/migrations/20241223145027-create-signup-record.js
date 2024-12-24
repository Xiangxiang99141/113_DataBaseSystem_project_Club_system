'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Signup_records', {
      su_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      M_id: {
        type: Sequelize.UUID,
        references:{
          model:'Members',
          key:'M_id'
        }
      },
      Su_type: {
        type: Sequelize.ENUM('社課','活動'),
        allowNull:false
      },
      Ca_id: {
        type: Sequelize.INTEGER,
        references:{
          model:'Club_activities',
          key:'Ca_id'
        }
      },
      Cc_id: {
        type: Sequelize.INTEGER,
        references:{
          model:'Club_courses',
          key:'Cc_id'
        }
      },
      Ins_id: {
        type: Sequelize.INTEGER,
        references:{
          model:'Insurances',
          key:'Ins_id'
        }
      },
      Ts_id: {
        type: Sequelize.INTEGER,
        references:{
          model:'Transportation',
          key:'Ts_id'
        }
      },
      Su_create_at: {
        type: Sequelize.DATE,
        allowNull:false
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Signup_records');
  }
};