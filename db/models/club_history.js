'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Club_history.belongsTo(models.Club,{
        foreignKey:'C_id'
      });
      // define association here
    }
  }
  Club_history.init({
    Ch_id: {
      allowNull:false,
      autoIncrement:true,
      primaryKey:true,
      type:DataTypes.INTEGER,
    },
    Ch_type: {
      type:DataTypes.ENUM('組織章程','器材規章','財務規章','其他'),
      allowNull:false
    },
    Ch_name: {
      type:DataTypes.STRING(20),
      allowNull:false
    },
    Ch_description: {
      type:DataTypes.STRING(50),
      allowNull:false
    },
    Ch_update_at: {
      type:DataTypes.DATE,
      allowNull:false
    },
    C_id: {
      type:DataTypes.BIGINT,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Club_history',
    tableName: 'Club_histories',
    timestamps: false
  });
  return Club_history;
};