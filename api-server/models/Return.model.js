const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    invoice_number: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    return_details: {
      type: String,
      required: true,
    },
    vendor: {
      type: String,
      default: "",
    },
    attachments: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      default: "Pending", // possible values: Approved, Completed
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Return", returnSchema);
