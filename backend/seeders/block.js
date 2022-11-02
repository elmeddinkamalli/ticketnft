const BlockModel = require("../modules/block/blockModel");
const Utils = require("../helper/utils");
const Blocks = {};

Blocks.inializeBlock = async () => {
  try {
    await BlockModel.insertMany([
      {
        blockNo: 0,
        createNewEvent: 0,
        mintingEventTicket: 0,
        burningTicket: 0,
        chainId: process.env.ETH_CHAIN_ID,
      },
    ]);
  } catch (err) {
    Utils.echoLog("error in adding new blocks");
  }
};

module.exports = Blocks;
