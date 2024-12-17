'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Club_meeting_participate_members', {
      Cm_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"Club_meetings",
          key:"Cm_id"
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Club_meeting_participate_members');
  }
};