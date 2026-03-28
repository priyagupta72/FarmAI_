import { createLogger, format, transports } from "winston";
import path from "path";

const { combine, timestamp, errors, json, colorize, printf } = format;

// ─── Dev format (human-readable) ─────────────────────────────────────────────
const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// ─── Logger ──────────────────────────────────────────────────────────────────
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }) // captures full stack trace on Error objects
  ),
  transports: [
    // Always write errors to a dedicated file
    new transports.File({
      filename: path.resolve("logs/error.log"),
      level: "error",
      format: json(),
    }),
    // Write all levels to combined log
    new transports.File({
      filename: path.resolve("logs/combined.log"),
      format: json(),
    }),
  ],
});

// In development — also print to console in readable format
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(colorize(), timestamp({ format: "HH:mm:ss" }), devFormat),
    })
  );
}

export default logger;