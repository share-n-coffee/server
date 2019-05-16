const mongoURI =
  'mongodb://demoman:wgforge1@ds147926.mlab.com:47926/demoproject';

module.exports = {
  database: `${process.env.NODE_MONGODB_URI || mongoURI}`,
  port: `${process.env.PORT || 3000}`,
  corsOptions: {
    origins: [
      'https://forgeserver.herokuapp.com',
      'http://random-coffee.fun',
      'https://loori-r.github.io',
      'http://localhost:3000'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  },
  telegramAuth: {
    clientID: `${process.env.NODE_TELEGRAM_ID}`,
    clientSecret: `${process.env.NODE_TELEGRAM_SECRET}`,
    callbackURL:
      'https://forge-development.herokuapp.com/auth/telegram/callback'
  },
  telegramBotToken: process.env.NODE_TELEGRAM_TOKEN,
  jwtSecret: 'baNaNa',
  frontendServer: 'http://random-coffee.fun'
};
