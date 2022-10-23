const Joi = require("joi");
const validate = require("../../helper/validateRequest");
const UserModel = require("../user/userModel");
const EventMiddleware = {};

EventMiddleware.checkUserCanCreateEvent = async (req, res, next) => {
  if (req.userData && req.userData.canCreateEvent) {
    return next();
  }
  return res.status(400).json({
    status: false,
    message: req.t("CANNOT_CREATE_EVENT"),
  });
};

EventMiddleware.validateAdd = async (req, res, next) => {
  const schema = Joi.object({
    ownerId: Joi.string(),
    eventName: Joi.string().required(),
    maxTicketSupply: Joi.number().required(),
    pricePerTicket: Joi.number().required(),
    image: Joi.string().required(),
  });
  validate.validateRequest(req, res, next, schema);
};

module.exports = EventMiddleware;
