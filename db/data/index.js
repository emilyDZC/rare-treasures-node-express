const ENV = process.env.NODE_ENV || 'development';
const testData = require('./test-data');
const devData = require('./dev-data');

const data = {
  development: devData,
  test: testData
};

module.exports = data[ENV];
