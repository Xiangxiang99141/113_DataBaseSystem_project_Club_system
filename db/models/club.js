'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Club extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Club.belongsToMany(models.Member,{
        through:models.Club_member,
        foreignKey:"C_id",
        
      });
      Club.hasMany(models.Club_sign_record,{
        foreignKey:"C_id"
      });
      Club.hasMany(models.Club_course,{
        foreignKey:"C_id"
      });
      Club.hasMany(models.Club_activity,{
        foreignKey:"C_id"
      });
    }
  }
  Club.init({
    C_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.BIGINT,
      defaultValue:Date.now()
    },
    C_name: {
      type:DataTypes.STRING(10),
      allowNull:false
    },
    C_type: {
      type:DataTypes.ENUM('服務性','學藝性','體能性','自治性','康樂性'),
      allowNull:false
    },
    C_intro: {
      type:DataTypes.STRING(50),
      allowNull:false
    },
    C_web: {
      type:DataTypes.STRING,
    },
    C_quota: {
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0
    },
    C_close: {
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },
    C_created_at:{
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue:new Date()
    },
    C_update_at:{
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue:new Date()
    }
  }, {
    sequelize,
    modelName: 'Club',
    tableName:'Clubs',
    timestamps:true,
    createdAt:'C_created_at',
    updatedAt:'C_update_at'
  });
  return Club;
};