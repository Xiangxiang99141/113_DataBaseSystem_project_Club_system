'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club_meeting extends Model {
    static associate(models) {
      // 修改關聯設置
      Club_meeting.belongsTo(models.Club, {
        foreignKey: "C_id"
      });
      Club_meeting.belongsTo(models.Member, {
        foreignKey: "Cm_chair"
      });
      Club_meeting.hasOne(models.Club_meeting_record, {
        foreignKey: "Cm_id"
      });
      Club_meeting.hasMany(models.Club_meeting_participate_member, {
        foreignKey: "Cm_id"
      });
    }
  }
  Club_meeting.init({
    Cm_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Cm_name: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    Cm_chair: {
      type: DataTypes.UUID,
      allowNull: false
    },
    Cm_content: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Cm_location: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    C_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    Cm_date_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Club_meeting',
    tableName: 'Club_meetings',
    timestamps: false,
    updatedAt: false,
    createdAt: false,
    comment:'社團會議'
  });
  return Club_meeting;
};