'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Club_meetings', {
      Cm_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
      },
      Cm_name: {
        type: Sequelize.STRING(15),
        allowNull:false
      },
      Cm_chair: {
        type: Sequelize.UUID,
        allowNull:false,
        references:{
          model:"Members",
          key:"M_id"
        }
      },
      Cm_content: {
        type: Sequelize.STRING(50),
        allowNull:false
      },
      Cm_location: {
        type: Sequelize.STRING(30),
        allowNull:false
      },
      C_id: {
        type: Sequelize.BIGINT,
        allowNull:false,
        references:{
          model:"Clubs",
          key:"C_id"
        }
      },
      Cm_date_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Club_meetings');
  }
};