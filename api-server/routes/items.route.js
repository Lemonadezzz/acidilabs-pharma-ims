const express = require("express");
const itemsController = require("../controllers/items.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Routes
router.get("/", authMiddleware.userCheck, itemsController.getAllItems);
router.get(
  "/archived",
  authMiddleware.userCheck,
  itemsController.getAllArchivedItems
);
router.get("/search", authMiddleware.userCheck, itemsController.searchItems);
router.get(
  "/categories",
  authMiddleware.userCheck,
  itemsController.getAllCategories
);
router.get("/warning", authMiddleware.userCheck, itemsController.getWarning);

router.post(
  "/create-item",
  authMiddleware.userCheck,
  itemsController.createItem
);
router.post(
  "/update-item",
  authMiddleware.userCheck,
  itemsController.updateItem
);
router.post(
  "/delete-item",
  authMiddleware.userCheck,
  itemsController.deleteItem
);
router.post("/use-item", authMiddleware.userCheck, itemsController.useItem);
router.post(
  "/add-category",
  authMiddleware.userCheck,
  itemsController.addCategory
);
router.post(
  "/archive-item",
  authMiddleware.userCheck,
  itemsController.archiveItem
);

module.exports = router;
