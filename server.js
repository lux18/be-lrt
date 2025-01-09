const express = require("express");
const app = express();
const port = 5000;
const db = require("./config/database");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const reportRoutes = require("./router/laporanRoute");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

(async () => {
  try {
    await db.authenticate();
    console.log("Database connected...");
    await db.sync();
  } catch (error) {
    console.log("Connection error: ", error);
  }
})();

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
