const { DataTypes } = require("@sequelize/core");
const sequelize = require("../config/database");

const Project = sequelize.define("Project", {
  projectId: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  members: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Project table has been created.", sequelize.models);
  })
  .catch((err) => {
    console.error("Unable to create the table:", err);
  });

module.exports = Project;
