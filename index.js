const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes");
const logger = require("./helpers/logger");

// Init app
const app = express();
// Use CORS
app.use(cors());

// Use body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define port
const port = 3000;

// Middleware to log requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Define routes
app.use("/api", router);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
  console.log(`Server started on port ${port}`);
});
