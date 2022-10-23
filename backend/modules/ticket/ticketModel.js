const mongoose = require("mongoose");

const { Schema } = mongoose;
const decryptProperty = function (value) {
  if (value) {
    return `${process.env.IPFSURL}/${value}`;
  } else {
    return null;
  }
};

const imageSchmea = new Schema({
  original: {
    type: String,
    default: null,
    get: decryptProperty,
  },
  compressed: {
    type: String,
    default: null,
    get: decryptProperty,
  },
  format: {
    type: String,
    default: null,
  },
  extra: { _id: false },
});

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
    image: imageSchmea,
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
