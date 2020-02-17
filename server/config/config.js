const config = {
  PORT: process.env.PORT || 3000,
  DATABASE: process.env.NODE_MONGODB_URI,
  MAX_DATABASE_CONNECTION_ATTEMPTS: 100,
  jwtSecret: process.env.NODE_JWT_SECRET,
  CORS_ENABLED: Boolean(+process.env.CORS_ENABLED),
  TELEGRAM_BOT_ENABLED: Boolean(+process.env.TELEGRAM_BOT_ENABLED)
};

config.CORS = {
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  origins:
    config.CORS_ENABLED && process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : '*'
};

if (config.TELEGRAM_BOT_ENABLED) {
  config.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
}

module.exports = config;
