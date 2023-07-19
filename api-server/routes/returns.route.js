const express = require("express");
const returnsController = require("../controllers/returns.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// routes
router.post(
  "/create-return",
  authMiddleware.userCheck,
  returnsController.createReturn
);
router.get("/", authMiddleware.userCheck, returnsController.getAllReturns);
router.get(
  "/search",
  authMiddleware.userCheck,
  returnsController.searchReturns
);
router.post(
  "/change-return-status",
  authMiddleware.userCheck,
  returnsController.changeReturnStatus
);
router.post(
  "/delete-return",
  authMiddleware.userCheck,
  returnsController.deleteReturn
);

module.exports = router;
