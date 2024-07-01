const Sequelize = require("@sequelize/core");
const { PostgresDialect } = require("@sequelize/postgres");

// @ts-ignore
const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: "task-manager-2",
  user: "postgres",
  password: "aayushi",
  host: "localhost",
  port: 5432,
  clientMinMessages: "notice",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
