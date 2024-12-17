'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club_member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //定義關聯
    }
  }
  Club_member.init({
    C_id: {
      type:DataTypes.BIGINT,
      allowNull:false
    },
    M_id: {
      type:DataTypes.UUID,
      allowNull:false
    },
    Cme_job: {
      type:DataTypes.ENUM('社長','副社長','幹部','社團指導老師','社員'),
      allowNull:false
    },
    Cme_member_join_at: {
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue:new Date()
    }
  }, {
    sequelize,
    modelName: 'Club_member',
    tableNameName: 'Club_members',
    timestamps:false,
    createdAt:false,
    updatedAt:false
  });
  return Club_member;
};