const Joi = require("joi");
const validate = require("../../helper/validateRequest");
const TicketModel = require("./ticketModel");
const TicketMiddleware = {};

TicketMiddleware.checkCanUserBuyTicket = async (req, res, next) => {
  const alreadyBrought = await TicketModel.find({
    ownerId: req.userData._id,
    eventId: req.body.eventId,
  });

  if (alreadyBrought && alreadyBrought.length) {
    return res.status(400).json({
      status: false,
      message: req.t("ALREADY_BOUGHT"),
    });
  }

  return next();
};

TicketMiddleware.validateAdd = async (req, res, next) => {
  const schema = Joi.object({
    eventId: Joi.string().required(),
    metadataURI: Joi.string().required(),
    image: Joi.string().required(),
    uniqueId: Joi.number().required(),
  });
  validate.validateRequest(req, res, next, schema);
};

module.exports = TicketMiddleware;
