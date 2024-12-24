'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Insurance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Insurance.belongsToMany(models.signup_record);
    }
  }
  Insurance.init({
    Ins_id: {
      primaryKey:true,
      autoIncrement:true,
      allowNull:false,
      type:DataTypes.INTEGER,
    },
    Ins_isadult: {
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true
    },
    Ins_idcard: {
      type:DataTypes.STRING,
      allowNull:false
    },
    Ins_engname: {
      type:DataTypes.STRING(50),
      defaultValue:null
    },
    Ins_nationality: {
      type:DataTypes.ENUM('中華民國','馬來西亞'),
      allowNull:false,
      defaultValue:'中華民國'
    },
    Ins_idcardimg: {
      type:DataTypes.STRING,
      defaultValue:null
    },
    Ins_birthday: {
      type:DataTypes.DATEONLY,
      allowNull:false
    },
    Ins_liaison: {
      type:DataTypes.STRING,
      defaultValue:null
    },
    Ins_liaison_phone: {
      type:DataTypes.STRING,
      defaultValue:null
    }
  }, {
    sequelize,
    modelName: 'Insurance',
    tableName: 'Insurances',
    timestamps:false
  });
  return Insurance;
};