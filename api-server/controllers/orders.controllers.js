const OrderModel = require("../models/Order.model");
const LogModel = require("../models/Log.model");
const { format } = require("date-fns");

// Create a new order
const createOrder = async (req, res) => {
  if (!req.body)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const order = new OrderModel(req.body);
    await order.save();

    // Logging the action
    await LogModel.create({
      type: "ORDER",
      action: "CREATE",
      message: `Order invoice no. : ${
        order.invoice_number
      } created successfully by ${req.userName} on ${format(
        new Date(),
        "p"
      )}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// get all orders
const getAllOrders = async (req, res) => {
  const { sortby, sortorder } = req.query;

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 200;
  const skip = (page - 1) * limit;

  try {
    const orders = await OrderModel.find({
      archived: false,
    })
      .sort({ [sortby]: sortorder })
      .skip(skip)
      .limit(limit);

    return res
      .status(200)
      .json({ success: true, message: "Orders fetched successfully", orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// change order status
const changeOrderStatus = async (req, res) => {
  const { id, status } = req.body;

  if (!id || !status)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Logging the action
    await LogModel.create({
      type: "ORDER",
      action: "UPDATE",
      message: `Order invoice no. : ${
        updatedOrder.invoice_number
      } status changed to ${status} by ${req.userName} on ${format(
        new Date(),
        "p"
      )}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(200).json({
      success: true,
      message: "Order status changed successfully",
      updatedOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete order
const deleteOrder = async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const deletedOrder = await OrderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Logging the action
    await LogModel.create({
      type: "ORDER",
      action: "DELETE",
      message: `Order invoice no. : ${
        deletedOrder.invoice_number
      } deleted successfully by ${req.userName} on ${format(
        new Date(),
        "p"
      )}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      deletedOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// search order
const searchOrder = async (req, res) => {
  const { q } = req.query;

  if (!q)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const orders = await OrderModel.find({
      $or: [
        { invoice_number: { $regex: q, $options: "i" } },
        { vendor: { $regex: q, $options: "i" } },
      ],
    });

    return res
      .status(200)
      .json({ success: true, message: "Orders fetched successfully", orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// edit order
const editOrder = async (req, res) => {
  const { id, ...rest } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { ...rest },
      {
        new: true,
      }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Logging the action
    await LogModel.create({
      type: "ORDER",
      action: "UPDATE",
      message: `Order invoice no. : ${
        updatedOrder.invoice_number
      } updated successfully by ${req.userName} on ${format(
        new Date(),
        "p"
      )}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      updatedOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// archive order
const archiveOrder = async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const archivedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { archived: true },
      {
        new: true,
      }
    );

    if (!archivedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Logging the action
    await LogModel.create({
      type: "ORDER",
      action: "ARCHIVE",
      message: `Order invoice no. : ${
        archivedOrder.invoice_number
      } archived successfully by ${req.userName} on ${format(
        new Date(),
        "p"
      )}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(200).json({
      success: true,
      message: "Order archived successfully",
      archivedOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// get all archived orders
const getArchivedOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ archived: true });

    return res
      .status(200)
      .json({ success: true, message: "Orders fetched successfully", orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  changeOrderStatus,
  deleteOrder,
  searchOrder,
  editOrder,
  archiveOrder,
  getArchivedOrders,
};
