const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const DBcontroller = require('../database/dbController');

const env = process.env.NODE_ENV || 'development';
const logDir = 'server/log';
const controller = new DBcontroller('log');

const logTypes = {
  userNotification: 'user_notification',
  userReply: 'user_reply',
  userSubscription: 'user_subscription',
  userBan: 'user_ban'
};

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD',
  format: format.json()
});

const consoleTransport = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.printf(info => `${info.timestamp} ${info.level} ${info.message}`)
  )
});

const logger = createLogger({
  // уровень логирования в зависимости от окружения
  level: 'error',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    })
  ),
  transports: [dailyRotateFileTransport]
});

if (env === 'development') {
  logger.add(consoleTransport);
}

module.exports = {
  error(err) {
    logger.error(err);
  },
  info(userId, type = 'unknown_type', payload = {}) {
    const jsonPayload = JSON.stringify(payload);
    controller
      .postNewLog({
        userId,
        type,
        payload: jsonPayload,
        timestamp: Date.now()
      })
      .catch(err => this.error(err));
  },
  logTypes
};
