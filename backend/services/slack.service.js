const request = require("request");
const url = process.env.SLACK_WEBHOOK;

function sendSlack(data = "Test") {
  var str = String(`${JSON.stringify(data)}`);
  // var btoas = btoa(str);
  // var atobs = atob(btoas);
  // data = atobs;
  data = str;
  try {
    request.post(
      {
        headers: { "Content-type": "application/json" },
        url,
        form: { payload: JSON.stringify({ text: data }) },
      },
      (error, res, body) => {}
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  sendSlack,
};
