'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transportation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transportation.belongsTo(models.signup_record);
    }
  }
  Transportation.init({
    Ts_id: {
      primaryKey:true,
      autoIncrement:true,
      allowNull:false,
      type:DataTypes.INTEGER,
    },
    Ts_method: {
      type:DataTypes.ENUM('自行出發','需協助安排','可協助載人','需借用安全帽'),
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Transportation',
    tableName: 'Transportations',
    timestamps:false
  });
  return Transportation;
};