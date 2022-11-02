const express = require("express");
const seeders = require("./seeders/seedersRoute");
const userRoute = require("./modules/user/userRoute");
const eventRoute = require("./modules/event/eventRoute");
const ticketRoute = require("./modules/ticket/ticketRoute");

const app = express.Router();

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1/seeders", seeders);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/events", eventRoute);
app.use("/api/v1/tickets", ticketRoute);
app.all("/*", (req, res) =>
  res.status(404).json({ message: "Invalid Request" })
);

module.exports = app;
