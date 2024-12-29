'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club_meeting_record extends Model {
    static associate(models) {
      Club_meeting_record.belongsTo(models.Club_meeting, {
        foreignKey: "Cm_id"
      });
    }
  }
  Club_meeting_record.init({
    Cm_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Cmr_content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Club_meeting_record',
    tableName: 'Club_meeting_records',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    comment:'會議記錄'
  });
  return Club_meeting_record;
};