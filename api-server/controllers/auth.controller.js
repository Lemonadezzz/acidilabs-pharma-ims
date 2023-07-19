const UserModel = require("../models/User.model");
const LogModel = require("../models/Log.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { format } = require("date-fns");

// Generate a token
const generateToken = (_id) => {
  return jwt.sign({ _id }, global.process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const initialize = async (req, res) => {
  try {
    // Checking if there is an admin user in the database
    const adminExists = await UserModel.findOne({ role: "Admin" });

    if (adminExists) {
      return res.status(200).json({
        success: true,
        adminExists: true,
        message: "Admin account already exists",
      });
    }

    return res.status(200).json({
      success: true,
      adminExists: false,
      message: "Admin account does not exist",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const authInfoProvider = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    return res
      .status(200)
      .json({ success: true, message: "Fetched auth info successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const signUpAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  }

  try {
    // Checking again if there is an admin user in the database (just in case)

    const adminExists = await UserModel.findOne({ role: "Admin" });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin account already exists",
      });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating new admin user
    const newAdminUser = await UserModel.create({
      username,
      password: hashedPassword,
      role: "Admin",
      permissions: {
        items: "R&W&D",
        orders: "R&W&D",
        returns: "R&W&D",
        suppliers: "R&W&D",
        logs: "R&W&D",
        archives: "R&W&D",
        users: "R&W&D",
      },
    });
    // Generating token
    const token = generateToken(newAdminUser._id);

    return res.status(200).json({
      success: true,
      message: "Admin account created successfully",
      token,
      user: newAdminUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const createUser = async (req, res) => {
  let { username, password, role, permissions } = req.body;

  if (!username || !password || !role || !permissions) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    // Checking if the username already exists
    const userExists = await UserModel.findOne({ username });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User account already exists",
      });
    }

    if (role === "Admin") {
      permissions = {
        items: "R&W&D",
        orders: "R&W&D",
        returns: "R&W&D",
        suppliers: "R&W&D",
        logs: "R&W&D",
        archives: "R&W&D",
        users: "R&W&D",
      };
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating new user
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      role,
      permissions,
      name: req.body.name ? req.body.name : "",
    });

    // Logging the action
    await LogModel.create({
      type: "AUTH",
      message: `New user account: ${newUser.username} created successfully by ${
        req.userName
      } on ${format(new Date(), "p")}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(200).json({
      success: true,
      message: "User account created successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  }

  try {
    // Checking if the username exists
    const user = await UserModel.findOne({ username });

    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "Invalid username or password" });

    // Checking if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res
        .status(403)
        .json({ success: false, message: "Invalid username or password" });

    // Generating token
    const token = generateToken(user._id);

    // Logging the action
    await LogModel.create({
      type: "AUTH",
      message: `User ${user.username} logged in successfully on ${format(
        new Date(),
        "p"
      )}  ${format(new Date(), "PPPP")}`,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { username, password, role, permissions } = req.body;

  if (!username || (!password && !role && !permissions)) {
    return res.status(400).json({
      success: false,
      message: "Username is missing or Nothing to update",
    });
  }
  try {
    // Checking if the user exists
    const user = await UserModel.findOne({ username });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "User account does not exist",
      });

    let hashedPassword;
    if (password) {
      // Hashing the password
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Updating user
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword || user.password,
        role: role || user.role,
        permissions: permissions || user.permissions,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "User account updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get all users
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// delete user
const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "User id is missing",
    });
  }
  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(400).json({
        success: false,
        message: "User account does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  initialize,
  signUpAdmin,
  createUser,
  login,
  updateUser,
  authInfoProvider,
  getUsers,
  deleteUser,
};
