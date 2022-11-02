const express = require("express");
const seeders = require("./seeders");

const seedersRoute = express.Router();

// initilize blocks
const initializeBlocks = [seeders.inializeBlocks];
seedersRoute.get("/initializeBlocks", initializeBlocks);

module.exports = seedersRoute;
