'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Club_records', {
      Cr_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
      },
      M_id: {
        type: Sequelize.UUID,
        allowNull:false,
        references:{
          model:"Members",
          key:"M_id"
        }
      },
      Cr_type: {
        type: Sequelize.ENUM('社課','社團活動'),
        allowNull:false
      },
      Ca_id: {
        type: Sequelize.INTEGER,
        references:{
          model:"Club_activities",
          key:"Ca_id"
        }
      },
      Cc_id: {
        type: Sequelize.INTEGER,
        references:{
          model:"Club_courses",
          key:"Cc_id"
        }
      },
      Cr_comment: {
        type: Sequelize.STRING,
        allowNull:false
      },
      Cr_vote: {
        type: Sequelize.ENUM('非常滿意','滿意','尚可','不滿意','非常不滿意'),
        allowNull:false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Club_records');
  }
};