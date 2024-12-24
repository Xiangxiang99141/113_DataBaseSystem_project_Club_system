'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Signup_record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Signup_record.belongsTo(models.Member, {
        foreignKey: "M_id"
      });
      Signup_record.belongsTo(models.Club_activity, {
        foreignKey: "Ca_id"
      });
      Signup_record.belongsTo(models.Club_course, {
        foreignKey: "Cc_id"
      });
      Signup_record.belongsTo(models.Transportation, {
        foreignKey: "Ts_id"
      });
      Signup_record.belongsTo(models.Insurance, {
        foreignKey: "Ins_id"
      });
    }
  }
  Signup_record.init({
    su_id: {
      primaryKey:true,
      autoIncrement:true,
      allowNull:false,
      type:DataTypes.INTEGER,
    },
    M_id: {
      type:DataTypes.UUID,
      allowNull:false,
    },
    Su_type: {
      type:DataTypes.ENUM('社課','活動'),
      allowNull:false
    },
    Ca_id: {
      type:DataTypes.INTEGER
    },
    Cc_id: {
      type:DataTypes.INTEGER
    },
    Ins_id: {
      type:DataTypes.INTEGER
    },
    Ts_id: {
      type:DataTypes.INTEGER,
      
    },
    Su_create_at: {
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue:new Date()
    }
  }, {
    sequelize,
    modelName: 'Signup_record',
    tableName: 'Signup_records',
    timestamps:true,
    createdAt:'Su_create_at',
    updatedAt:false
  });
  return Signup_record;
};