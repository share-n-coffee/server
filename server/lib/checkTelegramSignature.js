const { createHash, createHmac } = require('crypto');

const TOKEN = process.env.NODE_TOKEN;

const secret = createHash('sha256')
  .update(TOKEN)
  .digest();

function checkSignature({ hash, ...data }) {
  const checkString = Object.keys(data)
    .sort()
    .map(kay => `${kay}=${data[kay]}`)
    .join('\n');
  const hmac = createHmac('sha256', secret)
    .update(checkString)
    .digest('hex');
  return hmac === hash;
}

module.exports = checkSignature;
