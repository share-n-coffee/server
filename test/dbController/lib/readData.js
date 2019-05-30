const fs = require('fs');
const path = require('path');

const readData = filePath => {
  const resolvedFilePath = path.resolve(__dirname, filePath);
  return new Promise((resolve, reject) => {
    const data = fs.readFileSync(resolvedFilePath, 'utf8', error => {
      if (error) reject(error);
    });
    console.log(`Data succesfully read from ${filePath}!`);
    resolve(JSON.parse(data));
  });
};

module.exports = readData;
