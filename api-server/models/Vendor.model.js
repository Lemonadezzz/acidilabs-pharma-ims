const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    display_name: {
      type: String,
      required: true,
    },
    company_name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    contact: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Vendor", VendorSchema);
