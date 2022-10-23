const express = require("express");
const TicketCtr = require("./ticketController");
const Auth = require("../../helper/auth");
const auth = require("../../helper/auth");

const ticketRoute = express.Router();

// Get single ticket design
const getTicketDesign = [TicketCtr.getTicketDesign];
ticketRoute.get("/design/:id", getTicketDesign);

module.exports = ticketRoute;
