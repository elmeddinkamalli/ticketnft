const cron = require("node-cron");
const cronTasks = require("./cronTasks");

cron.schedule("* * * * *", async (req, res) => {
  // cron.schedule("*/10 * * * * *", (req, res) => {
  await cronTasks.getCreatedEvents(req, res, process.env.ETH_CHAIN_ID);
  await cronTasks.getCreatedEvents(req, res, process.env.BNB_CHAIN_ID);
  await cronTasks.getCreatedEvents(req, res, process.env.MATIC_CHAIN_ID);
  await cronTasks.getCreatedEvents(req, res, process.env.FTM_CHAIN_ID);

  await cronTasks.getCreatedTickets(req, res, process.env.ETH_CHAIN_ID);
  await cronTasks.getCreatedTickets(req, res, process.env.BNB_CHAIN_ID);
  await cronTasks.getCreatedTickets(req, res, process.env.MATIC_CHAIN_ID);
  await cronTasks.getCreatedTickets(req, res, process.env.FTM_CHAIN_ID);

  await cronTasks.getBurningTickets(req, res, process.env.ETH_CHAIN_ID);
  await cronTasks.getBurningTickets(req, res, process.env.BNB_CHAIN_ID);
  await cronTasks.getBurningTickets(req, res, process.env.MATIC_CHAIN_ID);
  await cronTasks.getBurningTickets(req, res, process.env.FTM_CHAIN_ID);
});
