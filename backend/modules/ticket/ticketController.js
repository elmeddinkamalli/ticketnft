const Utils = require("../../helper/utils");
const TicketDesignModel = require("../ticketDesign/ticketDesignModel");
const TicketModel = require("./ticketModel");

const TicketCtr = {};

// get single ticket design details
TicketCtr.getTicketDesign = async (req, res) => {
  try {
    let getTicketDesignDetails = JSON.parse(
      JSON.stringify(
        await TicketDesignModel.findById(req.params.id).populate({
          path: "eventId",
          populate: {
            path: "ownerId",
          },
        })
      )
    );

    getTicketDesignDetails.soldCount = await TicketModel.countDocuments({
      eventId: getTicketDesignDetails.eventId._id,
      isDraft: false,
    });

    if (req.userData) {
      const eventId = getTicketDesignDetails.eventId._id;
      getTicketDesignDetails.myTicket = await TicketModel.findOne({
        eventId: eventId,
        ownerId: req.userData._id,
        $or: [{ burned: { $exists: false } }, { burned: { $eq: false } }],
      });
    }

    return res.status(200).json({
      message: req.t("SINGLE_EVENT"),
      status: true,
      data: getTicketDesignDetails,
    });
  } catch (err) {
    Utils.echoLog("error in getTicketDesign  ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// get single ticket
TicketCtr.getTicket = async (req, res) => {
  try {
    let getTicketDetails = JSON.parse(
      JSON.stringify(
        await TicketModel.findOne({
          _id: req.params.id,
          $or: [{ burned: { $exists: false } }, { burned: { $eq: false } }],
        })
          .populate({
            path: "eventId",
            populate: {
              path: "ownerId",
            },
          })
          .populate({
            path: "ownerId",
          })
      )
    );

    if (!getTicketDetails) {
      return res.status(400).json({
        message: req.t("NOT_EXISTS"),
        status: false,
        err: "not found",
      });
    }

    getTicketDetails.soldCount = await TicketModel.countDocuments({
      eventId: getTicketDetails.eventId._id,
      isDraft: false,
    });

    return res.status(200).json({
      message: req.t("SINGLE_EVENT"),
      status: true,
      data: getTicketDetails,
    });
  } catch (err) {
    Utils.echoLog("error in getTicket  ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// create ticket
TicketCtr.createTicket = async (req, res) => {
  try {
    const { eventId, metadataURI, image, uniqueId } = req.body;
    const chainId = req.headers.chainid ?? null;

    const ticketDesignModel = await TicketDesignModel.findOne({
      eventId: eventId,
    });

    const createTicket = await new TicketModel({
      eventId: eventId,
      designId: ticketDesignModel._id,
      ownerId: req.userData._id,
      metadataURI: metadataURI,
      image: image,
      uniqueId: uniqueId,
      chainId: chainId,
    }).save();

    return res.status(200).json({
      message: req.t("ADD_NEW_TICKET"),
      status: true,
      data: {
        _id: createTicket._id,
      },
    });
  } catch (err) {
    Utils.echoLog("error in nft ticket", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

module.exports = TicketCtr;
