const cron = require("node-cron");
const cronTasks = require("./cronTasks");

cron.schedule("* * * * *", (req, res) => {
  // cron.schedule("*/10 * * * * *", (req, res) => {
  cronTasks.getCreatedEvents(req, res, process.env.ETH_CHAIN_ID);
  cronTasks.getCreatedTickets(req, res, process.env.ETH_CHAIN_ID);
  cronTasks.getBurningTickets(req, res, process.env.ETH_CHAIN_ID);
});
