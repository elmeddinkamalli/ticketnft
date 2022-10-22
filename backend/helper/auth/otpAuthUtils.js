const speakeasy = require("speakeasy");

const otpAuthUtils = {};

otpAuthUtils.generateSecret = () => {
  const secretCode = speakeasy.generateSecret();
  const url = speakeasy.otpauthURL({
    secret: secretCode.base32,
    label: "Admin",
    encoding: "base32",
  });
  let qrUrl =
    "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=" +
    encodeURI(url) +
    "&choe=UTF-8";
  return {
    url: url,
    secret: secretCode.base32,
    qr: qrUrl,
  };
};

otpAuthUtils.verify = (token, secret) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
    window: 100,
  });
};

module.exports = otpAuthUtils;
