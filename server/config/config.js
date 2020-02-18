module.exports = {
  PORT: process.env.PORT || 3000,
  DATABASE: process.env.NODE_MONGODB_URI,
  MAX_DATABASE_CONNECTION_ATTEMPTS: 100,
  TELEGRAM_BOT_ENABLED: Boolean(+process.env.TELEGRAM_BOT_ENABLED),
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  JWT_SECRET: process.env.NODE_JWT_SECRET,
  CORS: {
    enabled: Boolean(+process.env.CORS_ENABLED),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    origins: process.env.CORS_ORIGINS.split(',')
  }
};
