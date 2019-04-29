const passportInitializer = (passport, ...strategies) => {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));
  strategies.forEach(Strategy => {
    passport.use(Strategy);
  });
};

module.exports = passportInitializer;
