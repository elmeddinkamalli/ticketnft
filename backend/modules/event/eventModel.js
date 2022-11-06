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
      required: false,
      default: null,
    },
    eventId: {
      type: Number,
      default: null,
      required: false,
    },
    chainId: {
      type: Number,
      required: true,
    },
    eventURI: {
      type: String,
      required: false,
      default: null,
      get: decryptProperty,
    },
    description: {
      type: String,
      required: false,
      default: null,
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
    paused: {
      type: Boolean,
      default: false,
    },
    saleStarts: {
      type: Number,
      default: 0,
    },
    saleEnds: {
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

eventSchema.index(
  { eventId: 1, chainId: 1 },
  { unique: true, partialFilterExpression: { eventId: { $type: "string" } } }
);

module.exports = mongoose.model("events", eventSchema);
