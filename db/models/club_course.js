'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club_course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Club_course.belongsTo(models.Club,{
        foreignKey:"C_id"
      });
      Club_course.hasOne(models.Signup_record,{
        foreignKey:"Cc_id"
      })
    }
  }
  Club_course.init({
    Cc_id: {
      type:DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull:false
    },
    Cc_name: {
      type:DataTypes.STRING(15),
      allowNull:false
    },
    Cc_content: {
      type:DataTypes.STRING(150),
      allowNull:false
    },
    Cc_location: {
      type:DataTypes.STRING(30),
      allowNull:false
    },
    Cc_date: {
      type:DataTypes.DATE,
      allowNull:false
    },
    Cc_quota: {
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:false
    },
    Cc_open_at: {
      type:DataTypes.DATE,
      allowNull:false
    },
    Cc_close_at: {
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
    C_id: {
      type:DataTypes.BIGINT,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Club_course',
    tableName: 'Club_courses',
    timestamps:false,
    comment:'社團課程'
  });
  return Club_course;
};