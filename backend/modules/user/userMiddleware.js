const Joi = require("joi");
const validate = require("../../helper/validateRequest");
const UserModel = require("./userModel");
const UserMiddleware = {};

UserMiddleware.signUpValidator = (req, res, next) => {
  const socailSchema = Joi.object().keys({
    username: [Joi.string().optional(), Joi.allow(null)],
    url: [Joi.string().optional(), Joi.allow(null)],
    isVerified: Joi.boolean(),
  });

  const portfolioSchema = Joi.object().keys({
    instagarm: socailSchema,
    facebook: socailSchema,
    github: socailSchema,
    twitter: socailSchema,
    website: socailSchema,
  });

  const schema = Joi.object({
    name: Joi.string(),
    surname: Joi.string(),
    isCreator: Joi.boolean(),
    portfolio: portfolioSchema,
    email: Joi.string().email(),
    bio: Joi.string(),
    username: Joi.string(),
    cover: Joi.string(),
    category: Joi.array().items(Joi.string()),
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
