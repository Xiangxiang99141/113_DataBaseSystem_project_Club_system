'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Insurance_img extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Insurance_img.belongsTo(models.Insurance)
      // define association here
    }
  }
  Insurance_img.init({
    Insimg_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type:DataTypes.INTEGER
    },
    front: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    obverse: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    Ins_id: {
      type:DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Insurance_img',
    timestamps:false
  });
  return Insurance_img;
};