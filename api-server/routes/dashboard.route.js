const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const OrderModel = require("../models/Order.model");
const ItemModel = require("../models/Item.model");
const ReturnModel = require("../models/Return.model");

const router = express.Router();

// get dashboard data
router.get("/", authMiddleware.adminCheck, async (req, res) => {
  try {
    // get order count for Open, Confirmed, Completed, Cancelled
    const totalOrderCount = await OrderModel.countDocuments();
    const openOrderCount = await OrderModel.countDocuments({ status: "Open" });
    const confirmedOrderCount = await OrderModel.countDocuments({
      status: "Confirmed",
    });
    const completedOrderCount = await OrderModel.countDocuments({
      status: "Completed",
    });
    // const cancelledOrderCount = await OrderModel.countDocuments({
    //     status: "Cancelled",
    // });

    // get return count for Pending, Approved, Completed
    const totalReturnCount = await ReturnModel.countDocuments();
    const pendingReturnCount = await ReturnModel.countDocuments({
      status: "Pending",
    });
    const approvedReturnCount = await ReturnModel.countDocuments({
      status: "Approved",
    });
    // const completedReturnCount = await ReturnModel.countDocuments({
    //   status: "Completed",
    // });

    // get item count for on stock, out of stock, low on stock
    const totalItemCount = await ItemModel.countDocuments();
    const onStockItemCount = await ItemModel.countDocuments({
      status: "on stock",
    });
    const outOfStockItemCount = await ItemModel.countDocuments({
      status: "out of stock",
    });
    // const lowOnStockItemCount = await ItemModel.countDocuments({
    //     status: "low on stock",
    // });

    return res.status(200).json({
      orders: {
        total: totalOrderCount,
        open: openOrderCount,
        confirmed: confirmedOrderCount,
        completed: completedOrderCount,
        cancelled:
          totalOrderCount -
          openOrderCount -
          confirmedOrderCount -
          completedOrderCount,
      },
      returns: {
        total: totalReturnCount,
        pending: pendingReturnCount,
        approved: approvedReturnCount,
        completed: totalReturnCount - pendingReturnCount - approvedReturnCount,
      },
      items: {
        total: totalItemCount,
        onStock: onStockItemCount,
        outOfStock: outOfStockItemCount,
        lowOnStock: totalItemCount - onStockItemCount - outOfStockItemCount,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
