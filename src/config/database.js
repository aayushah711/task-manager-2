const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("task-manager-2", "postgres", "aayushi", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;
