const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const DBcontroller = require('../database/dbController');

const env = process.env.NODE_ENV || 'development';
const logDir = 'server/log';
const controller = new DBcontroller('log');

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD',
  format: format.json()
});

const consoleTransport = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.printf(
      info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    )
  )
});

const logger = createLogger({
  // уровень логирования в зависимости от окружения
  level: 'error',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.label({ label: path.basename(process.mainModule.filename) })
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
  info(userId, logType, logMessage) {
    controller
      .postNewLog({
        userId,
        type: logType,
        message: logMessage,
        timestamp: Date.now()
      })
      .then(data => console.log(data))
      .catch(err => this.error(err));
  }
};
