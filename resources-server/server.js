const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const logger = require("morgan");
const uploadRoute = require("./routes/upload.route");

// Constants
const PORT = global.process.env.PORT || 9000;

const app = express();

// Configurations
dotenv.config();

// Middlewares
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

// Routes
app.use("/", express.static("uploads"));
app.use("/actions", uploadRoute);

// Database connection
mongoose
  .connect(global.process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Initialization
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log("DB Connection err", err));
