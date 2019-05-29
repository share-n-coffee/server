const isNull = require('./isNull');
const isUndefined = require('./isUndefined');

module.exports = function nullAndUndefinedValidation(...args) {
  args.forEach(arg => {
    if (isNull(arg)) {
      console.log('Argument should not be null');
    }
    if (isUndefined(arg)) {
      console.log('Argument should not be undefined');
    }
  });
};
