const express = require("express");
// const seeders = require("./seeders/seedersRoute");
const userRoute = require("./modules/user/userRoute");

const app = express.Router();

// Routes
app.use("/api/v1/user", userRoute);
app.all("/*", (req, res) =>
  res.status(404).json({ message: "Invalid Request" })
);

module.exports = app;
