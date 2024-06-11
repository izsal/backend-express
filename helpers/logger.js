const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, errors } = format;

// Define the custom format for the logs
const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create the logger instance
const logger = createLogger({
  level: "info",
  format: combine(
    errors({ stack: true }), // Include stack trace if error
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), myFormat),
    }),
    new transports.File({ filename: "logs/app.log" }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
  // exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
  // rejectionHandlers: [new transports.File({ filename: "logs/rejections.log" })],
});

// If you want to log uncaught exceptions and unhandled rejections to the console as well
logger.exceptions.handle(
  new transports.Console({ format: combine(colorize(), timestamp(), myFormat) })
);
logger.rejections.handle(
  new transports.Console({ format: combine(colorize(), timestamp(), myFormat) })
);

module.exports = logger;
