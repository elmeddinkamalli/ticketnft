const Utils = require("../../helper/utils");
const TicketModel = require("../ticket/ticketModel");
const TicketDesignModel = require("../ticketDesign/ticketDesignModel");
const EventModel = require("./eventModel");

const EventCtr = {};

// Create Events
EventCtr.create = async (req, res) => {
  try {
    const {
      eventName,
      maxTicketSupply,
      pricePerTicket,
      image,
      ticketDesignIsDefault,
      ticketImage,
      eventURI,
      eventDescription,
      saleStarts,
      saleEnds,
    } = req.body;

    const chainId = req.headers.chainid ?? null;

    const createNewEvent = new EventModel({
      ownerId: req.userData._id,
      eventName: eventName,
      maxTicketSupply: maxTicketSupply,
      pricePerTicket: pricePerTicket,
      image: image,
      eventURI: eventURI,
      description: eventDescription,
      chainId: chainId,
      saleStarts: saleStarts,
      saleEnds: saleEnds,
    });

    const saveEvent = await createNewEvent.save();

    await new TicketDesignModel({
      eventId: saveEvent._id,
      image: ticketImage,
      isDefault: ticketDesignIsDefault,
    }).save();

    return res.status(200).json({
      message: req.t("ADD_NEW_EVENT"),
      status: true,
      data: {
        _id: saveEvent._id,
      },
    });
  } catch (err) {
    Utils.echoLog("error in event create", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// get single event details
EventCtr.getEvent = async (req, res) => {
  try {
    let getEventDetails = JSON.parse(
      JSON.stringify(
        await EventModel.findById(req.params.id).populate({
          path: "ownerId",
          select: { name: 1, username: 1, profile: 1 },
        })
      )
    );

    getEventDetails.ticketSoldCount = await TicketModel.countDocuments({
      eventId: req.params.id,
      isDraft: false,
    });

    getEventDetails.ticketDesigns = await TicketDesignModel.find({
      eventId: getEventDetails._id,
    });

    return res.status(200).json({
      message: req.t("SINGLE_EVENT"),
      status: true,
      data: getEventDetails,
    });
  } catch (err) {
    Utils.echoLog("error in getEvent  ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// get events
EventCtr.getEvents = async (req, res) => {
  let sortQuery = {};
  if (req.query.createdAt == "desc") {
    sortQuery.createdAt = -1;
  } else {
    sortQuery.createdAt = 1;
  }

  try {
    let getEvents = JSON.parse(
      JSON.stringify(
        await EventModel.find({ image: { $ne: null }, isDraft: false })
          .sort(sortQuery)
          .limit(req.query.take && req.query.take < 21 ? +req.query.take : 20)
          .populate({
            path: "ownerId",
            select: { name: 1, username: 1, profile: 1 },
          })
      )
    );

    return res.status(200).json({
      message: req.t("SINGLE_EVENT"),
      status: true,
      data: getEvents,
    });
  } catch (err) {
    Utils.echoLog("error in getEvent  ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

module.exports = EventCtr;
