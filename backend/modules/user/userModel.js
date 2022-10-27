const mongoose = require("mongoose");
const { status } = require("../../helper/enum");

const { Schema } = mongoose;
const decryptProperty = function (value) {
  if (value) {
    return `${process.env.BASE_URL}/uploads/avatars//${value}`;
  } else {
    return null;
  }
};

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      default: null,
      lowercase: true,
    },
    email: {
      type: String,
      required: false,
      default: null,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      default: undefined,
      sparse: true,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    profile: {
      type: String,
      // lowercase: true,
      default: null,
      get: decryptProperty,
    },
    cover: {
      type: String,
      default: null,
      get: decryptProperty,
    },
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    canCreateEvent: {
      type: Boolean,
      default: false,
    },
    isActive: {
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
// coinSchema.index({ address: 1 }, { unique: true });
module.exports = mongoose.model("users", userSchema);
