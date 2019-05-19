const checkEnvironment = (config, server) => {
  Object.keys(config).forEach(key => {
    if (config[key] === undefined) {
      throw new Error('Please check your environment variables');
    }
  });
  return server;
};

module.exports = checkEnvironment;
