const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      default: "",
    },
    shelf: {
      type: String,
      default: "unknown",
    },
    status: {
      type: String,
      default: "on stock", // possible values: on stock, out of stock, low on stock
    },
    category: {
      type: String,
      default: "other", // other category is for items that don't fit in any other category
    },
    low_stock_warning_qty: {
      type: Number,
      default: 1,
    },
    expiry_date: {
      type: Date,
      default: null,
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

module.exports = mongoose.model("Item", itemSchema);
