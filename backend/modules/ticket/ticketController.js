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

    return res.status(200).json({
      message: req.t("SINGLE_EVENT"),
      status: true,
      data: getTicketDesignDetails,
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

// create ticket
TicketCtr.createTicket = async (req, res) => {
  try {
    const { eventId, metadataCID, image } = req.body;

    const ticketDesignModel = await TicketDesignModel.findOne({
      eventId: eventId,
    });

    const createTicket = await new TicketModel({
      eventId: eventId,
      designId: ticketDesignModel._id,
      ownerId: req.userData._id,
      metadataCID: metadataCID,
      image: image,
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
