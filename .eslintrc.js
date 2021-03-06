module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 0,
    'no-unused-vars': 0,
    'no-plusplus': 0
  }
};
