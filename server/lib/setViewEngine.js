const setViewEngine = server => {
  server.set('view engine', 'ejs');
  server.set('views', `${__dirname}/../views`);
};

module.exports = setViewEngine;
