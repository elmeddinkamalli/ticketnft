const express = require("express");
const UserCtr = require("./userController");
const UserMiddleware = require("./userMiddleware");
const Auth = require("../../helper/auth");
const auth = require("../../helper/auth");

const userRoute = express.Router();

// login user
const login = [UserMiddleware.loginCheck, UserCtr.login];
userRoute.post("/login", login);

// get user details
const getDetails = [auth.isAuthenticatedUser, UserCtr.getUserDetails];
userRoute.get("/userDetails", getDetails);

// genrate nonce
const genrateNonce = [UserCtr.genrateNonce];
userRoute.get("/genrateNonce/:address", genrateNonce);

// get single user Details
// const getSingleUserDetails = [
//   Auth.checkIsAuthenticated,
//   UserCtr.getSingleUserDetails,
// ];
// userRoute.get("/getSingleUser/:userId", getSingleUserDetails);

// genrate acces token
// const genrateAccessToken = [
//   Auth.isAuthenticatedUser,
//   UserCtr.genrateAccessTokenForTwitter,
// ];
// userRoute.get("/twitter/access_token", genrateAccessToken);

module.exports = userRoute;
