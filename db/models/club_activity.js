'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club_activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Club_activity.hasOne(models.Signup_record, {
        foreignKey: "Ca_id"
      });
    }
  }
  Club_activity.init({
    Ca_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    Ca_name: {
      type:DataTypes.STRING(15),
      allowNull:false
    },
    Ca_content: {
      type:DataTypes.STRING(150),
      allowNull:false
    },
    Ca_location: {
      type:DataTypes.STRING(30),
      allowNull:false
    },
    Ca_date: {
      type:DataTypes.DATE,
      allowNull:false
    },
    Ca_quota: {
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0
    },
    Ca_open_at: {
      type:DataTypes.DATE,
      allowNull:false
    },
    Ca_close_at: {
      type:DataTypes.DATE,
      allowNull:false
    },
    insurance: {
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },
    transportation: {
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },
    Ca_plan: {
      type:DataTypes.STRING
    },
    C_id: {
      type:DataTypes.BIGINT,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Club_activity',
    tableName: 'Club_activities',
    timestamps:false,
    updatedAt:false,
    createdAt:false
  });
  return Club_activity;
};