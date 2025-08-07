const winston = require('winston');
import type { TransformableInfo } from 'logform';

/**
 * Custom log format with timestamp, level, and message
 */
const customFormat = winston.format.printf((info: TransformableInfo): string => {
  const { timestamp, level, message } = info;
  return `${timestamp} ${level}: ${message}`;
});

/**
 * Winston logger instance
 */
exports.logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});
