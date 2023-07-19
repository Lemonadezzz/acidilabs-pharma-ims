const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true, // possible values: AUTH, ITEM, ORDER, RETURN, VENDOR
    },
    message: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      default: "CREATE", // possible values: CREATE, UPDATE, DELETE
    },
    status: {
      type: String,
      default: "UNREAD", // possible values: READ, UNREAD
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Log", logSchema);
