const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Routes
router.get("/", authController.initialize);
router.get("/info", authMiddleware.userCheck, authController.authInfoProvider);
router.post("/login", authController.login);
router.post("/signup-admin", authController.signUpAdmin);
router.post(
  "/create-user",
  authMiddleware.adminCheck,
  authController.createUser
);
router.post(
  "/update-user",
  authMiddleware.userCheck,
  authController.updateUser
);
router.get("/get-users", authMiddleware.adminCheck, authController.getUsers);
router.post(
  "/delete-user",
  authMiddleware.adminCheck,
  authController.deleteUser
);

module.exports = router;
