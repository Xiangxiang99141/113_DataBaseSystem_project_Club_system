'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club_meeting_participate_member extends Model {
    static associate(models) {
      Club_meeting_participate_member.belongsTo(models.Club_meeting, {
        foreignKey: "Cm_id"
      });
      Club_meeting_participate_member.belongsTo(models.Member, {
        foreignKey: "M_id"
      });
    }
  }
  Club_meeting_participate_member.init({
    Cm_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    M_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Club_meeting_participate_member',
    tableName: 'Club_meeting_participate_members',
    timestamps: false,
    createdAt: false,
    updatedAt: false
  });
  return Club_meeting_participate_member;
};