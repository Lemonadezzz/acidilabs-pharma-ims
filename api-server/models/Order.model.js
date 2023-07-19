const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    invoice_number: {
      type: String,
      required: true,
    },
    order_date: {
      type: Date,
      required: true,
    },
    delivery_date: {
      type: Date,
      required: true,
    },
    order_details: {
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
      default: "Open", // possible values: confirmed, completed, cancelled
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Order", orderSchema);
