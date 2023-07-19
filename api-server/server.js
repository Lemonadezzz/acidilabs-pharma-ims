const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const logger = require("morgan");
const authRoute = require("./routes/auth.route");
const itemsRoute = require("./routes/items.route");
const ordersRoute = require("./routes/orders.route");
const returnsRoute = require("./routes/returns.route");
const vendorsRoute = require("./routes/vendors.route");
const logsRoute = require("./routes/logs.route");
const dashboardRoute = require("./routes/dashboard.route");

// Constants
const PORT = global.process.env.PORT || 8000;

const app = express();

// Configurations
dotenv.config();

// Middlewares
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to the API" });
});

app.use("/api/auth", authRoute);
app.use("/api/items", itemsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/returns", returnsRoute);
app.use("/api/vendors", vendorsRoute);
app.use("/api/logs", logsRoute);
app.use("/api/dashboard", dashboardRoute);

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
