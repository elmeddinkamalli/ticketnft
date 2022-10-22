const cron = require("node-cron");

cron.schedule("* * * * *", (req, res) => {
  console.log("Checking...");
});
