const Sequelize = require("sequelize");
require("dotenv").config();
// const db = new Sequelize("lrtdb", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

const db = new Sequelize("defaultdb", "doadmin", "AVNS_p19xy2Ayg4klMaUjV6a", {
  host: "db-mysql-nyc3-83512-do-user-15463270-0.j.db.ondigitalocean.com",
  dialect: "mysql",
  port: "25060",
  dialectModule: require("mysql2"),
});

module.exports = db;
