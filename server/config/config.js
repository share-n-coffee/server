module.exports = {
  database: `${process.env.NODE_MONGODB_URI}`,
  port: `${process.env.PORT || 3000}`,
  corsOptions: {
    origin: 'https://forgeserver.herokuapp.com/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  },
  telegramAuth: {
    clientID: `${process.env.NODE_TELEGRAM_ID}`,
    clientSecret: `${process.env.NODE_TELEGRAM_SECRET}`,
    callbackURL: 'https://forgeserver.herokuapp.com/auth/telegram/callback'
  }
};
