const express = require("express");
const ordersController = require("../controllers/orders.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// routes
router.post(
  "/create-order",
  authMiddleware.userCheck,
  ordersController.createOrder
);
router.get("/", authMiddleware.userCheck, ordersController.getAllOrders);
router.get(
  "/archived",
  authMiddleware.userCheck,
  ordersController.getArchivedOrders
);
router.get("/search", authMiddleware.userCheck, ordersController.searchOrder);
router.post(
  "/change-order-status",
  authMiddleware.userCheck,
  ordersController.changeOrderStatus
);
router.post(
  "/delete-order",
  authMiddleware.userCheck,
  ordersController.deleteOrder
);
router.post(
  "/edit-order",
  authMiddleware.userCheck,
  ordersController.editOrder
);
router.post(
  "/archive-order",
  authMiddleware.userCheck,
  ordersController.archiveOrder
);

module.exports = router;
