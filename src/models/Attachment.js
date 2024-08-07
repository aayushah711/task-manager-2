const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Attachment = sequelize.define(
  "attachment",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { modelName: "attachment", tableName: "attachments" }
);

module.exports = Attachment;
