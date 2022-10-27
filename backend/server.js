const http = require("http");
global.__basedir = __dirname;

require("dotenv").config();

process.env.TZ = "UTC";
const app = require("./config/app");

http.createServer(app).listen(app.get("port"), () => {
  console.log(`TicketNFT to the moon ${app.get("port")}`);
});
