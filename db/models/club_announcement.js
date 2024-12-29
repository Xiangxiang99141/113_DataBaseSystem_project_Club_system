'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club_announcement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Club_announcement.belongsTo(models.Club,{
        foreignKey:'C_id'
      })
    }
  }
  Club_announcement.init({
    Can_id: {
      allowNull:false,
      primaryKey:true,
      autoIncrement:true,
      type:DataTypes.INTEGER,
    },
    Can_type:{
      type:DataTypes.ENUM('一般公告','活動調整','緊急'),
      allowNull:false
    },
    Can_title: {
      type:DataTypes.STRING(20),
      allowNull:false
    },
    Can_content: {
      type:DataTypes.TEXT,
      allowNull:false
    },
    Can_attachment: {
      type:DataTypes.STRING,
    },
    Can_image: {
      type:DataTypes.STRING,
    },
    Can_created_at: {
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue:new Date()
    },
    C_id: {
      type:DataTypes.BIGINT,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Club_announcement',
    tableName: 'Club_announcements',
    timestamps:true,
    createdAt:'Can_created_at',
    updatedAt:false,
    comment:'社團公告'
  });
  return Club_announcement;
};