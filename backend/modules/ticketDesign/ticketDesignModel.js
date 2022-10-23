const mongoose = require("mongoose");

const { Schema } = mongoose;
const decryptProperty = function (value) {
  if (value) {
    return `${process.env.IPFSURL}/${value}`;
  } else {
    return null;
  }
};

const ticketDesignSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "events",
      required: true,
    },
    image: {
      type: String,
      default: null,
      get: decryptProperty,
      required: false,
    },
    isDefault: {
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

module.exports = mongoose.model("ticketDesigns", ticketDesignSchema);
