const mongoose = require("mongoose");

const { Schema } = mongoose;
const decryptProperty = function (value) {
  if (value) {
    return `${process.env.IPFSURL}/${value}`;
  } else {
    return null;
  }
};

const eventSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    eventName: {
      type: String,
      required: false,
      default: null,
    },
    maxTicketSupply: {
      type: Number,
      default: 0,
      required: true,
    },
    pricePerTicket: {
      type: Number,
      default: 0,
      required: true,
    },
    image: {
      type: String,
      default: null,
      get: decryptProperty,
      required: false,
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);

module.exports = mongoose.model("events", eventSchema);
