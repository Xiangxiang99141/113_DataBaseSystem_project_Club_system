'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Club_equipments', {
      Ce_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Ce_name: {
        type: Sequelize.STRING(10),
        allowNull:false
      },
      Ce_spec: {
        type: Sequelize.STRING(20),
        allowNull:false
      },
      Ce_count: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      Ce_use: {
        type: Sequelize.STRING(20),
        allowNull:false
      },
      Ce_source: {
        type: Sequelize.ENUM('社團自籌','學校經費','贊助'),
        allownull:false
      },
      Ce_img: {
        type: Sequelize.STRING
      },
      Ce_admin: {
        type: Sequelize.UUID,
        allowNull:false,
        references:{
          model:'Members',
          key:'M_id'
        }
      },
      Ce_report: {
        type: Sequelize.UUID,
        references:{
          model:'Members',
          key:'M_id'
        }
      },
      Ce_purch_at: {
        type: Sequelize.DATEONLY,
        allowNull:false
      },
      C_id: {
        type: Sequelize.BIGINT,
        references:{
          model:'Clubs',
          key:'C_id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Club_equipments');
  }
};