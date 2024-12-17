'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club_sign_record extends Model {
    
    static associate(models) {
    }
  }
  Club_sign_record.init({
    M_id: {
      type:DataTypes.UUID,
      allowNull:false
    },
    signup_at: {
      type:DataTypes.DATE,
      allowNull:false
    },
    singup_cause: {
      type:DataTypes.STRING(20),
      allowNull:false
    },
    is_verify: {
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },
    not_verify_cause: {
      type:DataTypes.STRING(20),
    },
    C_id: {
      type:DataTypes.BIGINT,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Club_sign_record',
    tableName: 'Club_sign_records',
    timestamps:false,
    createdAt:false,
    updatedAt:false
  });
  return Club_sign_record;
};