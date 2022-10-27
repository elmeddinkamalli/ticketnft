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
      required: true,
    },
    metadataCID: {
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
  },

  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
  }
);

module.exports = mongoose.model("tickets", ticketSchema);
