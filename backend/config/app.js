const express = require("express");
global._ = require("lodash");
require("./winston");
require("./database.js");
require("../cron/cron");
const l10n = require("jm-ez-l10n");

const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

function exitHandler(options) {
  mongoose.connection.close();
  process.exit();
}
process.on("SIGINT", exitHandler.bind(null, { cleanup: true }));

// language response json
l10n.setTranslationsFile("en", "./language/translation.en.json");
app.use(l10n.enableL10NExpress);

app.set("port", process.env.PORT);
app.use(bodyParser.json({ limit: "1gb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "1gb" }));
app.use(cors());
app.use(require("../route.js"));

app.all("/*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Request-Headers", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, x-auth-token, x-l10n-locale, Cache-Control, timeout"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

module.exports = app;
