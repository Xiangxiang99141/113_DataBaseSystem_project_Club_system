'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Club_histories', {
      Ch_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Ch_type: {
        type: Sequelize.ENUM("組織章程","器材規章","財務規章","其他"),
        allowNull:false
      },
      Ch_name: {
        type: Sequelize.STRING(20),
        allowNull:false
      },
      Ch_description: {
        type: Sequelize.STRING(50),
        allowNull:false
      },
      Ch_attachment:{
        type:Sequelize.STRING,
      },
      Ch_update_at: {
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Club_histories');
  }
};