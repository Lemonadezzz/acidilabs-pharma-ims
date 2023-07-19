/* eslint-disable no-undef */
const fs = require("fs");
const path = require("path");

/* Directory creation middleware */
exports.makePdfDir = async (req, res, next) => {
  // check if directory exists
  console.log(__dirname);
  if (fs.existsSync(path.join(__dirname, "../uploads"))) {
    if (fs.existsSync(path.join(__dirname, "../uploads/pdf"))) {
      next();
    } else {
      fs.mkdirSync(path.join(__dirname, "../uploads/pdf"));
      next();
    }
  } else {
    if (fs.existsSync(path.join(__dirname, "../uploads/pdf"))) {
      next();
    } else {
      fs.mkdirSync(path.join(__dirname, "../uploads"));
      fs.mkdirSync(path.join(__dirname, "../uploads/pdf"));
      next();
    }
  }
};
