const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define("Task", {
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
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Task table has been created.", sequelize.models);
  })
  .catch((err) => {
    console.error("Unable to create the Task table:", err);
  });

module.exports = Task;
