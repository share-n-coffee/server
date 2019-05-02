module.exports = {
  "database": `${process.env.MONGODB_URI}`,
  "port": `${process.env.PORT || 3000}`,
  "corsOptions": {
    "origin": "https://forgeserver.herokuapp.com/",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "credentials": true
  },
  "telegramAuth": {
    "clientID": `${process.env.TELEGRAM_ID}`,
    "clientSecret": `${process.env.TELEGRAM_SECRET}`,
    "callbackURL": "https://forgeserver.herokuapp.com/auth/telegram/callback"
  }
}