const Sequelize = require("sequelize");
require("dotenv").config();
// const db = new Sequelize("lrtdb", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

const db = new Sequelize("defaultdb", "doadmin", process.env.DB_PASS, {
  host: "db-mysql-nyc3-83512-do-user-15463270-0.j.db.ondigitalocean.com",
  dialect: "mysql",
  port: "25060",
});

module.exports = db;
