const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const logModel = require('../database/models/log');

const Log = logModel('demo_log');

const env = process.env.NODE_ENV || 'development';
const logDir = 'server/log';

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
  info(userId, actionType, action) {
    const log = new Log({
      userId,
      actionType,
      action
    });
    log.save().catch(error => logger.error(error));
  }
};
