const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const logsController = require("../controllers/logs.controller");

const router = express.Router();

// Routes
router.get("/", authMiddleware.adminCheck, logsController.getAllLogs);
router.post(
  "/mark-as-read",
  authMiddleware.adminCheck,
  logsController.markLogAsRead
);
router.post("/delete-log", authMiddleware.adminCheck, logsController.deleteLog);
router.post(
  "/delete-read-logs",
  authMiddleware.adminCheck,
  logsController.deleteReadLogs
);

module.exports = router;
