const express = require("express");
const TicketCtr = require("./ticketController");
const Auth = require("../../helper/auth");
const auth = require("../../helper/auth");
const TicketMiddleware = require("./ticketMiddleware");

const ticketRoute = express.Router();

// Get single ticket design
const getTicketDesign = [Auth.checkIsAuthenticated, TicketCtr.getTicketDesign];
ticketRoute.get("/design/:id", getTicketDesign);

// Get single ticket
const getTicket = [Auth.isAuthenticatedUser, TicketCtr.getTicket];
ticketRoute.get("/:id", getTicket);

// Create user ticket
const createTicket = [
  Auth.isAuthenticatedUser,
  TicketMiddleware.validateAdd,
  TicketMiddleware.checkCanUserBuyTicket,
  TicketCtr.createTicket,
];
ticketRoute.post("/create", createTicket);

module.exports = ticketRoute;
