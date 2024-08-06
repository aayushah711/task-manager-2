const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { taskStatus } = require("../constants");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    dueDate: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM(...taskStatus),
      defaultValue: "open",
    },
  },
  { modelName: "Task", tableName: "Tasks" }
);

module.exports = Task;
