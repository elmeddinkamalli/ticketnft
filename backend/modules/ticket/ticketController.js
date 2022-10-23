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

module.exports = TicketCtr;
