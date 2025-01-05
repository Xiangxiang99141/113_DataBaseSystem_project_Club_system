'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Insurances', {
      Ins_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Ins_isadult: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      Ins_idcard: {
        type: Sequelize.STRING,
        allowNull:false
      },
      Ins_engname: {
        type: Sequelize.STRING(50)
      },
      Ins_nationality: {
        type: Sequelize.ENUM('中華民國','馬來西亞'),
        allowNull:false
      },
      Ins_idcardimg: {
        type: Sequelize.INTEGER
      },
      Ins_birthday: {
        type: Sequelize.DATEONLY,
        allowNull:false
      },
      Ins_liaison: {
        type: Sequelize.STRING,
        defaultValue:null
      },
      Ins_liaison_phone: {
        type: Sequelize.STRING,
        defaultValue:null
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Insurances');
  }
};