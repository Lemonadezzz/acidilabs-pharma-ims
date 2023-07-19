/* eslint-disable no-undef */
const express = require("express");
const path = require("path");
const multer = require("multer");
const uploadMiddleware = require("../middlewares/upload.middleware");
const uploadController = require("../controllers/upload.controller");

const router = express.Router();

const storagePdf = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/pdf"));
  },
  filename: function (req, file, cb) {
    cb(null, +Date.now() + "_" + file.originalname);
  },
});

const fileFilterPdf = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const uploadPdfHandler = multer({
  storage: storagePdf,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: fileFilterPdf,
});

router.post(
  "/add-pdf",
  uploadMiddleware.makePdfDir,
  uploadPdfHandler.single("file"),
  uploadController.uploadPdf
);

module.exports = router;
