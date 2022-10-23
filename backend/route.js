const express = require("express");
// const seeders = require("./seeders/seedersRoute");
const userRoute = require("./modules/user/userRoute");
const eventRoute = require("./modules/event/eventRoute");

const app = express.Router();

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/events", eventRoute);
app.all("/*", (req, res) =>
  res.status(404).json({ message: "Invalid Request" })
);

module.exports = app;
