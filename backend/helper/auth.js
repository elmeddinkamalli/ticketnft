const utils = require("./utils");
const userModel = require("../modules/user/userModel");
const errorUtil = require("./error");
const jwtUtil = require("./jwtUtils");

const auth = {};
// check authentication
auth.isAuthenticatedUser = async (req, res, next) => {
  let token = req.headers && req.headers["x-auth-token"];

  if (utils.empty(token)) {
    token = req.body && req.body["x-auth-token"];
  }
  const userTokenData = jwtUtil.decodeAuthToken(token);

  if (utils.empty(userTokenData)) {
    return errorUtil.notAuthenticated(res, req);
  }

  const fetchUserDetails = await userModel.findById(userTokenData._id);

  if (fetchUserDetails && fetchUserDetails.isActive) {
    req.userData = fetchUserDetails;
    return next();
  } else {
    return errorUtil.notAuthenticated(res, req);
  }
};

auth.isAdmin = async (req, res, next) => {
  if (req.role === "ADMIN") {
    return next();
  } else {
    return errorUtil.notAuthenticated(res, req);
  }
};

auth.checkIsAuthenticated = async (req, res, next) => {
  let token = req.headers && req.headers["x-auth-token"];

  if (utils.empty(token)) {
    token = req.body && req.body["x-auth-token"];
  }
  const userTokenData = jwtUtil.decodeAuthToken(token);

  if (utils.empty(userTokenData)) {
    return next();
  }

  const fetchUserDetails = await userModel.findById(userTokenData._id);

  if (fetchUserDetails && fetchUserDetails.isActive) {
    req.userData = fetchUserDetails;
    return next();
  } else {
    return errorUtil.notAuthenticated(res, req);
  }
};
module.exports = auth;
