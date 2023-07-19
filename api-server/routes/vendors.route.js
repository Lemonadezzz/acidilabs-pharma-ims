const express = require("express");
const vendorsController = require("../controllers/vendors.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// routes
router.post(
  "/create-vendor",
  authMiddleware.userCheck,
  vendorsController.createVendor
);
router.get("/", authMiddleware.userCheck, vendorsController.getAllVendors);
router.post(
  "/update-vendor",
  authMiddleware.userCheck,
  vendorsController.updateVendor
);
router.post(
  "/delete-vendor",
  authMiddleware.userCheck,
  vendorsController.deleteVendor
);

module.exports = router;
