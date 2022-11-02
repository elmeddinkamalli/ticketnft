const Joi = require("joi");
const validate = require("../../helper/validateRequest");
const UserModel = require("./userModel");
const UserMiddleware = {};

UserMiddleware.signUpValidator = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().allow(null),
    isCreator: Joi.boolean(),
    email: Joi.string().email().allow(null),
    profile: Joi.object({
      type: Joi.string().valid("image/png", "image/jpeg", "image/jpg"),
      size: 15,
    }).unknown(true),
    bio: Joi.string().allow(null),
    username: Joi.string().alphanum().min(3).max(30).allow(null),
    cover: Joi.string().allow(null),
  });
  validate.validateRequest(req, res, next, schema);
};

UserMiddleware.checkUsernameAlreadyAdded = async (req, res, next) => {
  if (req.body.username) {
    const checkUsernameAvalaible = await UserModel.findOne({
      username: req.body.username.toLowerCase(),
    });
    if (
      checkUsernameAvalaible &&
      req.userData._id.toString() !== checkUsernameAvalaible._id.toString()
    ) {
      return res.status(400).json({
        status: false,
        message: req.t("USERNAME_ALREADY"),
      });
    } else {
      return next();
    }
  } else {
    return next();
  }
};
// check address already avalaible
UserMiddleware.checkAddressAvalaible = async (req, res, next) => {
  const getWalletDetails = await UserModel.findOne({
    walletAddress: req.body.walletAddress.toLowerCase().trim(),
  });
  if (getWalletDetails) {
    return res.status(400).json({
      message: req.t("WALLET_ADDRESS_ALREADY_REGISTERD"),
      status: false,
    });
  } else {
    return next();
  }
};

// check wallet address
UserMiddleware.loginValidator = async (req, res, next) => {
  const schema = Joi.object({
    walletAddress: Joi.string().required(),
  });
  validate.validateRequest(req, res, next, schema);
};

// login
UserMiddleware.loginCheck = async (req, res, next) => {
  const schema = Joi.object({
    nonce: Joi.string().required(),
    signature: Joi.string().required(),
  });
  validate.validateRequest(req, res, next, schema);
};

// check address already registed
UserMiddleware.checkAddressAlreadyRegistered = async (req, res, next) => {
  try {
    const checkWalletRegisterded = await UserModel.findOne({
      walletAddress: req.body.walletAddress.toLowerCase().trim(),
    });
    if (checkWalletRegisterded) {
      return res.status(400).json({
        message: req.t("USER_WALLET_ALREADY_REGISTERED"),
        status: false,
      });
    } else {
      return next();
    }
  } catch (err) {
    Utils.echoLog("error in listing user   ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

module.exports = UserMiddleware;
