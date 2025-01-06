'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Insurance_imgs', {
      Insimg_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      front: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      obverse: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },{
      comment: '保險正反面', //資料表備註
    }
  );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Insurance_imgs');
  }
};