const mongoose = require("mongoose");
const Utils = require("../helper/utils");
mongoose.Promise = require("bluebird");

let mongoUrl = process.env.DATABASEURL;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => {
    // mongoose.pluralize(null);
    // mongoose.set('debug', true);

    mongoose.set("useFindAndModify", false);

    console.log("database connected successfully at", mongoUrl);
  })
  .catch((error) => {
    Utils.echoLog("error in connecting with database ", error);
    console.log("error in connecting with database ", error);
  });
