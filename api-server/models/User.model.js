const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "Guest",
    },
    profile_pic_url: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true,
      default: "User",
    },
    permissions: {
      type: Object,
      default: {
        items: "R",
        orders: "R",
        returns: "R",
        suppliers: "R",
        logs: "U",
        archives: "R",
        users: "U",
      }, // U = Unauthorized R = Read, W = Write, D = Delete
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);
