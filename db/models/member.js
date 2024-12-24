'use strict';
const Sequelize = require('sequelize');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Member.belongsToMany(models.Club, {
        through: models.Club_member,
        foreignKey: "M_id"
      });
      Member.hasMany(models.Club_record,{
        foreignKey:"M_id"
      });
      Member.hasMany(models.Signup_record, {
        foreignKey: "M_id"
      });
    }
  }
  Member.init({
    M_id:{
      type:DataTypes.UUID,
      allowNull:false,
      primaryKey:true,
      defaultValue:Sequelize.UUIDV4
    },
    M_account: {
      type:DataTypes.STRING(20),
      allowNull:false
    },
    M_name: {
      type:DataTypes.STRING(30),
      allowNull:false
    },
    M_pwd: {
      type:DataTypes.STRING,
      allowNull:false
    },
    M_phone: {
      type:DataTypes.STRING(12)
    },
    email: {
      type:DataTypes.STRING
    },
    M_register_at: {
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue:new Date()
    }
  }, {
    sequelize,
    modelName: 'Member',
    tableName:'Members',
    timestamps:false,
    createdAt:'M_register_at',
    updatedAt:false
  });
  return Member;
};