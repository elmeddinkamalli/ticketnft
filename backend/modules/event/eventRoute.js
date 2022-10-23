const express = require("express");
const EventCtr = require("./eventController");
const EventMiddleware = require("./eventMiddleware");
const Auth = require("../../helper/auth");
const auth = require("../../helper/auth");

const eventRoute = express.Router();

// create event
const create = [
  Auth.isAuthenticatedUser,
  EventMiddleware.checkUserCanCreateEvent,
  EventMiddleware.validateAdd,
  EventCtr.create,
];
eventRoute.post("/create", create);

// Get single event
const getEvent = [EventCtr.getEvent];
eventRoute.get("/:id", getEvent);

module.exports = eventRoute;
