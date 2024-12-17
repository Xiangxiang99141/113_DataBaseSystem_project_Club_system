'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Club_members', {
      C_id: {
        type: Sequelize.BIGINT,
        allowNull:false,
        references:{
          model:"Clubs",
          key:"C_id"
        }
      },
      M_id: {
        type: Sequelize.UUID,
        allowNull:false,
        references:{
          model:"Members",
          key:"M_id"
        }
      },
      Cme_job: {
        type: Sequelize.ENUM('社長','副社長','幹部','社團指導老師','社員'),
        allowNull:false
      },
      Cme_member_join_at: {
        type: Sequelize.DATE,
        allowNull:false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Club_members');
  }
};