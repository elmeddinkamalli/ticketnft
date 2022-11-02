const mongoose = require("mongoose");

const { Schema } = mongoose;
const decryptProperty = function (value) {
  if (value) {
    return `${process.env.IPFSURL}/${value}`;
  } else {
    return null;
  }
};

const ticketSchema = new Schema(
  {
    uniqueId: {
      type: Number,
      unique: true,
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "events",
      required: true,
    },
    designId: {
      type: Schema.Types.ObjectId,
      ref: "events",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    ownerWalletAddress: {
      type: String,
      required: false,
    },
    metadataURI: {
      type: String,
      default: null,
      get: decryptProperty,
    },
    image: {
      type: String,
      default: null,
      get: decryptProperty,
    },
    isDraft: {
      type: Boolean,
      required: true,
      default: true,
    },
    chainId: {
      type: Number,
      required: true,
    },
    tokenId: {
      type: Number,
      required: false,
    },
    burned: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);

ticketSchema.index(
  { tokenId: 1, chainId: 1 },
  { unique: true, partialFilterExpression: { tokenId: { $type: "string" } } }
);
module.exports = mongoose.model("tickets", ticketSchema);
