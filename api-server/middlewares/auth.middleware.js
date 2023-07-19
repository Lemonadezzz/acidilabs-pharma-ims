const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");

/* Admin check middleware */
const adminCheck = async (req, res, next) => {
  // Getting the token from the header
  const { authorization } = req.headers;

  if (!authorization)
    return res
      .status(403)
      .json({ success: false, message: "Invalid credentials" });

  const token = authorization.split(" ")[1];

  try {
    // Verifying the token
    const { _id } = jwt.verify(token, global.process.env.JWT_SECRET);

    // Getting the user from the database
    const user = await UserModel.findOne({ _id });
    if (user.role !== "Admin")
      return res
        .status(403)
        .json({ success: false, message: "Invalid credentials" });

    req.userName = user.username;
    // Allowing the request to go through
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ success: false, message: "Invalid credentials" });
  }
};

// User check middleware
const userCheck = async (req, res, next) => {
  // Getting the token from the header
  const { authorization } = req.headers;

  if (!authorization)
    return res
      .status(403)
      .json({ success: false, message: "Invalid credentials" });

  const token = authorization.split(" ")[1];

  try {
    // Verifying the token
    const { _id } = jwt.verify(token, global.process.env.JWT_SECRET);

    if (!_id)
      return res
        .status(403)
        .json({ success: false, message: "Invalid credentials" });

    // Getting the user from the database
    const user = await UserModel.findOne({ _id });
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Invalid credentials" });

    // Allowing the request to go through and adding the user id to the request
    req.userId = _id;
    req.userRole = user.role;
    req.userName = user.username;
    req.userPermissions = user.permissions;

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ success: false, message: "Invalid credentials" });
  }
};

module.exports = { adminCheck, userCheck };
