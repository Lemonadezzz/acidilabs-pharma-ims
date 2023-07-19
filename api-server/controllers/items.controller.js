const ItemModel = require("../models/Item.model");
const LogModel = require("../models/Log.model");
const CategoryModel = require("../models/Category.model");
const { format, differenceInDays } = require("date-fns");

const getAllItems = async (req, res) => {
  const { sortby, sortorder } = req.query;

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 200;
  const skip = (page - 1) * limit;

  try {
    // sorting and pagination
    const items = await ItemModel.find({
      archived: false,
    })
      .sort({ [sortby]: sortorder })
      .skip(skip)
      .limit(limit);

    return res
      .status(200)
      .json({ success: true, message: "Items fetched successfully", items });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllArchivedItems = async (req, res) => {
  const { sortby, sortorder } = req.query;

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 200;
  const skip = (page - 1) * limit;

  try {
    // sorting and pagination
    const items = await ItemModel.find({
      archived: true,
    })
      .sort({ [sortby]: sortorder })
      .skip(skip)
      .limit(limit);

    return res
      .status(200)
      .json({ success: true, message: "Items fetched successfully", items });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create a new item
const createItem = async (req, res) => {
  const {
    name,
    qty,
    sku,
    shelf,
    status,
    category,
    low_stock_warning_qty,
    expiry_date,
  } = req.body;

  if (!name || !qty) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const newItem = await ItemModel.create({
      name,
      qty,
      sku,
      shelf,
      status,
      category,
      low_stock_warning_qty: Number(low_stock_warning_qty),
      expiry_date,
    });

    if (!newItem)
      return res.status(500).json({ success: false, message: "Server error" });

    // Logging the action
    await LogModel.create({
      type: "ITEM",
      action: "CREATE",
      message: `New item: ${newItem.name} created successfully by ${
        req.userName
      } on ${format(new Date(), "p")}  ${format(new Date(), "PPPP")}`,
    });

    return res
      .status(201)
      .json({ success: true, message: "Item created successfully", newItem });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update an item
const updateItem = async (req, res) => {
  const { id, data } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const updatedItem = await ItemModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // Logging the action
    await LogModel.create({
      type: "ITEM",
      action: "UPDATE",
      message: `Item: ${updatedItem.name} updated successfully by ${
        req.userName
      } on ${format(new Date(), "p")}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      updatedItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete an item
const deleteItem = async (req, res) => {
  const { id } = req.body;
  console.log(id);
  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const deletedItem = await ItemModel.findByIdAndDelete(id);
    console.log(deletedItem);

    if (!deletedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // Logging the action
    await LogModel.create({
      type: "ITEM",
      action: "DELETE",
      message: `Item: ${deletedItem.name} deleted successfully by ${
        req.userName
      } on ${format(new Date(), "p")}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      deletedItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// use an item
const useItem = async (req, res) => {
  const { id, usedAmount } = req.body;

  if (!id || !usedAmount)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const item = await ItemModel.findById(id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    if (item.qty < usedAmount) {
      return res.status(400).json({
        success: false,
        message: "Not enough items in stock",
      });
    }

    const updatedItem = await ItemModel.findByIdAndUpdate(
      id,
      { qty: item.qty - usedAmount },
      { new: true }
    );

    // Logging the action
    await LogModel.create({
      type: "ITEM",
      action: "USE",
      message: `Item: ${updatedItem.name} used at Quantity: ${usedAmount} by ${
        req.userName
      } on ${format(new Date(), "p")}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(200).json({
      success: true,
      message: "Item used successfully",
      updatedItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Search items
const searchItems = async (req, res) => {
  const { q } = req.query;

  if (!q)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const items = await ItemModel.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { sku: { $regex: q, $options: "i" } },
      ],
    });

    return res
      .status(200)
      .json({ success: true, message: "Items fetched successfully", items });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// add category
const addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const category = await CategoryModel.create({ name });

    if (!category)
      return res.status(500).json({ success: false, message: "Server error" });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// get warning when the stock qty is less than low_stock_warning_qty of the item
const getWarning = async (req, res) => {
  try {
    const items = await ItemModel.find({
      archived: false,
    });

    if (!items) {
      return res
        .status(404)
        .json({ success: false, message: "Items not found" });
    }

    const warningItems = items.filter(
      (item) =>
        item.qty <=
        (item.low_stock_warning_qty ? item.low_stock_warning_qty : 2)
    );

    // map the warning items to add the warning message
    const warningItemsWithType = warningItems.map((item) => {
      return {
        ...item._doc,
        warning_type: "Low Stock Warning",
      };
    });

    // item expiry_date is less than 30 days from today
    const expiryItemsMonth = items.filter(
      (item) =>
        item.expiry_date &&
        differenceInDays(new Date(item.expiry_date), new Date()) <= 30
    );

    // map the expiry items to add the warning message
    const expiryItemsWithType = expiryItemsMonth.map((item) => {
      return {
        ...item._doc,
        warning_type: "Expiry Warning",
      };
    });

    return res.status(200).json({
      success: true,
      message: "Items fetched successfully",
      items: [...warningItemsWithType, ...expiryItemsWithType],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const archiveItem = async (req, res) => {
  const { id, isArchived } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });

  try {
    const archivedItem = await ItemModel.findByIdAndUpdate(
      id,
      { archived: isArchived },
      { new: true }
    );

    if (!archivedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // Logging the action
    // await LogModel.create({
    //   type: "ITEM",
    //   action: "ARCHIVE",
    //   message: `Item: ${archivedItem.name} archived successfully by ${
    //     req.userName
    //   } on ${format(new Date(), "p")}  ${format(new Date(), "PPPP")}`,
    // });

    return res.status(200).json({
      success: true,
      message: "Item archived successfully",
      archivedItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  useItem,
  searchItems,
  addCategory,
  getAllCategories,
  getWarning,
  getAllArchivedItems,
  archiveItem,
};
