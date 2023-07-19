const VendorModel = require("../models/Vendor.model");
const LogModel = require("../models/Log.model");
const { format } = require("date-fns");

// Create a new vendor
const createVendor = async (req, res) => {
  if (!req.body)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const newVendor = new VendorModel(req.body);
    await newVendor.save();

    // Logging the action
    await LogModel.create({
      type: "VENDOR",
      action: "CREATE",
      message: `Vendor: ${newVendor.display_name} created successfully by ${
        req.userName
      } on ${format(new Date(), "p")}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      vendor: newVendor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await VendorModel.find({});
    return res.status(200).json({
      success: true,
      message: "Vendors fetched successfully",
      vendors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// update a vendor
const updateVendor = async (req, res) => {
  const { id, data } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const updatedVendor = await VendorModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedVendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    // Logging the action
    await LogModel.create({
      type: "VENDOR",
      action: "UPDATE",
      message: `Vendor: ${updatedVendor.display_name} updated successfully by ${
        req.userName
      } on ${format(new Date(), "p")}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete a vendor
const deleteVendor = async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const deletedVendor = await VendorModel.findByIdAndDelete(id);

    if (!deletedVendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    // Logging the action
    await LogModel.create({
      type: "VENDOR",
      action: "DELETE",
      message: `Vendor: ${deletedVendor.display_name} deleted successfully by ${
        req.userName
      } on ${format(new Date(), "p")}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
      vendor: deletedVendor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createVendor,
  getAllVendors,
  updateVendor,
  deleteVendor,
};
