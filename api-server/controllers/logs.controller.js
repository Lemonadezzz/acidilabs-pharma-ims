const LogModel = require("../models/Log.model");

// Get all logs
const getAllLogs = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 25;
  const skip = (page - 1) * limit;

  try {
    if (req.query.type === "ALL" && req.query.status === "ALL") {
      // sorting by time and pagination
      const logs = await LogModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res
        .status(200)
        .json({ success: true, message: "Logs fetched successfully", logs });
    }

    if (req.query.type === "ALL" && req.query.status === "UNREAD") {
      // sorting by time and pagination && filtering by status
      const logs = await LogModel.find({
        status: { $regex: req.query.status, $options: "i" },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res
        .status(200)
        .json({ success: true, message: "Logs fetched successfully", logs });
    }

    // sorting by time and pagination
    const logs = await LogModel.find({
      type: { $regex: req.query.type, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res
      .status(200)
      .json({ success: true, message: "Logs fetched successfully", logs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// mark a log as read
const markLogAsRead = async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const updatedLog = await LogModel.findByIdAndUpdate(
      id,
      { status: "READ" },
      { new: true }
    );

    if (!updatedLog)
      return res.status(404).json({ success: false, message: "Log not found" });

    return res.status(200).json({
      success: true,
      message: "Log marked as read successfully",
      log: updatedLog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete a log
const deleteLog = async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const deletedLog = await LogModel.findByIdAndDelete(id);

    if (!deletedLog)
      return res.status(404).json({ success: false, message: "Log not found" });

    return res.status(200).json({
      success: true,
      message: "Log deleted successfully",
      log: deletedLog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete READ logs
const deleteReadLogs = async (req, res) => {
  try {
    await LogModel.deleteMany({ status: "READ" });

    return res.status(200).json({
      success: true,
      message: "Logs deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllLogs,
  markLogAsRead,
  deleteLog,
  deleteReadLogs,
};
