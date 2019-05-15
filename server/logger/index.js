const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = 'server/log';

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD',
  format: format.json()
});

const logger = createLogger({
  // уровень логирования в зависимости от окружения
  level: env === 'development' ? 'verbose' : 'warn',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [dailyRotateFileTransport]
});

if (env === 'development') {
  logger.add(
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    })
  );
}

module.exports = {
  error(err) {
    logger.error(err);
  }
};
