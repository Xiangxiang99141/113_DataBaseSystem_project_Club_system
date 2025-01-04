'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club_equipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Club_equipment.belongsTo(models.Club,{
        foreignKey:'C_id'
      });
      Club_equipment.belongsTo(models.Member,{
        foreignKey:'Ce_admin'
      });
      Club_equipment.belongsTo(models.Member,{
        foreignKey:'Ce_report'
      });
    }
  }
  Club_equipment.init({
    Ce_id: {
      allownull:false,
      primaryKey:true,
      autoIncrement:true,
      type:DataTypes.INTEGER,
    },
    Ce_name: {
      type:DataTypes.STRING(30),
      allownull:false
    },
    Ce_spec: {
      type:DataTypes.STRING(20),
      allownull:false
    },
    Ce_count: {
      type:DataTypes.INTEGER,
      allownull:false
    },
    Ce_use: {
      type:DataTypes.STRING(20),
      allownull:false
    },
    Ce_source: {
      type:DataTypes.ENUM('社團自籌','學校經費','贊助'),
      allownull:false
    },
    Ce_img: {
      type:DataTypes.STRING
    },
    Ce_admin: {
      type:DataTypes.UUID,
      allownull:false
    },
    Ce_report: {
      type:DataTypes.UUID,
      allownull:false
    },
    Ce_purch_at: {
      type:DataTypes.DATEONLY,
      allownull:false
    },
    C_id: {
      type:DataTypes.BIGINT,
      allownull:false
    }
  }, {
    sequelize,
    modelName: 'Club_equipment',timestamps:false,
    tableName:'Club_equipments',
    comment:'社團器材'
  });
  return Club_equipment;
};