'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club_record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Club_record.belongsTo(models.Club_activity,{
        foreignKey:"Ca_id"
      });
      Club_record.belongsTo(models.Club_course,{
        foreignKey:"Cc_id"
      });
      Club_record.belongsTo(models.Member,{
        foreignKey:"M_id"
      });
    }
  }
  Club_record.init({
    Cr_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    M_id: {
      type:DataTypes.UUID,
      allowNull:false
    },
    Cr_type: {
      type:DataTypes.ENUM('社課','社團活動'),
      allowNull:false
    },
    Ca_id: {
      type:DataTypes.INTEGER
    },
    Cc_id: {
      type:DataTypes.INTEGER
    },
    Cr_comment: {
      type:DataTypes.STRING,
      allowNull:false
    },
    Cr_vote: {
      type:DataTypes.ENUM('非常滿意','滿意','尚可','不滿意','非常不滿意'),
      allowNull:false
    },
    C_id:{
      type:DataTypes.BIGINT,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Club_record',
    tableName: 'Club_records',
    timestamps:false,
    comment:'活動社課參與紀錄'
  });
  return Club_record;
};