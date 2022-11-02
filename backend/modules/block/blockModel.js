const mongoose = require("mongoose");

const { Schema } = mongoose;

const blockSchema = new Schema(
  {
    blockNo: {
      type: Number,
      default: 0,
    },
    createNewEvent: {
      type: Number,
      default: 0,
    },
    mintingEventTicket: {
      type: Number,
      default: 0,
    },
    burningTicket: {
      type: Number,
      default: 0,
    },
    chainId: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);

module.exports = mongoose.model("blocks", blockSchema);
