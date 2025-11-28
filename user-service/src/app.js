const express = require("express");
const cors = require("cors");
const sequelize = require("./database");
const userRoutes = require("./routes/user-routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/users", userRoutes);

app.use(errorHandler);

sequelize.sync()
  .then(() => console.log("Database synced"))
  .catch(console.error);

module.exports = app;
