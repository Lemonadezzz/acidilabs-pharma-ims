const ReturnModel = require("../models/Return.model");
const OrderModel = require("../models/Order.model");
const LogModel = require("../models/Log.model");
const { format } = require("date-fns");

// Create a new return
const createReturn = async (req, res) => {
  if (!req.body)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  const { invoice_number, order_details, vendor } = req.body.orderInfo;

  try {
    const newReturn = new ReturnModel({
      invoice_number,
      vendor,
      reason: req.body.reason,
      return_details: order_details,
      attachments: req.body.attachments,
    });
    await newReturn.save();

    // update order status
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.body.order_id,
      {
        status: "Cancelled",
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Logging the action
    await LogModel.create({
      type: "RETURN",
      action: "CREATE",
      message: `Return invoice no. : ${
        newReturn.invoice_number
      } created successfully by ${req.userName} on ${format(
        new Date(),
        "p"
      )}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(201).json({
      success: true,
      message: "Return created successfully",
      return: newReturn,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// get all returns
const getAllReturns = async (req, res) => {
  try {
    const returns = await ReturnModel.find();
    return res.status(200).json({
      success: true,
      message: "Returns fetched successfully",
      returns,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// change return status
const changeReturnStatus = async (req, res) => {
  const { id, status } = req.body;

  if (!id || !status)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const updatedReturn = await ReturnModel.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      }
    );

    if (!updatedReturn) {
      return res
        .status(404)
        .json({ success: false, message: "Return not found" });
    }

    // Logging the action
    await LogModel.create({
      type: "RETURN",
      action: "UPDATE",
      message: `Return invoice no. : ${
        updatedReturn.invoice_number
      } status updated to ${status} by ${req.userName} on ${format(
        new Date(),
        "p"
      )}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(200).json({
      success: true,
      message: "Return status updated successfully",
      return: updatedReturn,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete return
const deleteReturn = async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const deletedReturn = await ReturnModel.findByIdAndDelete(id);

    if (!deletedReturn) {
      return res
        .status(404)
        .json({ success: false, message: "Return not found" });
    }

    // Logging the action
    await LogModel.create({
      type: "RETURN",
      action: "DELETE",
      message: `Return invoice no. : ${
        deletedReturn.invoice_number
      } deleted by ${req.userName} on ${format(new Date(), "p")}  ${format(
        new Date(),
        "PPPP"
      )}`,
    });

    return res.status(200).json({
      success: true,
      message: "Return deleted successfully",
      return: deletedReturn,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// search returns
const searchReturns = async (req, res) => {
  const { q } = req.query;

  if (!q)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const returns = await ReturnModel.find({
      $or: [{ invoice_number: { $regex: q, $options: "i" } }],
    });

    return res
      .status(200)
      .json({ success: true, message: "Orders fetched successfully", returns });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createReturn,
  getAllReturns,
  changeReturnStatus,
  deleteReturn,
  searchReturns,
};
