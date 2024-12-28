'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Club_sign_records', {
      id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true        
      },
      M_id: {
        type: Sequelize.UUID,
        allowNull:false,
        references:{
          model:"Members",
          key:"M_id"
        }
      },
      signup_at: {
        type: Sequelize.DATE,
        allowNull:false
      },
      signup_cause: {
        type: Sequelize.STRING(20),
        allowNull:false
      },
      is_verify: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      not_verify_cause: {
        type: Sequelize.STRING(20)
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
    await queryInterface.dropTable('Club_sign_records');
  }
};