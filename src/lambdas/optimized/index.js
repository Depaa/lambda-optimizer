const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const https = require('https');

// eslint-disable-next-line no-unused-vars
const dynamodb = new DynamoDBClient({ region: 'eu-central-1' });
const LOOP_INDEX = 35;
const URL = 'https://www.google.com/';

const fibonacci = (n) => {
  if (n < 2) return 1;
  return fibonacci(n - 2) + fibonacci(n - 1);
};

const fetchWelcomePage = async (index) => new Promise((resolve, reject) => {
  https.get(URL, (res) => {
    console.debug(index);
    resolve(res.statusCode);
  }).on('error', (e) => {
    reject(Error(e));
  });
});

exports.handler = async () => {
  console.time('fibonacci');
  fibonacci(LOOP_INDEX);
  console.timeEnd('fibonacci');

  console.time('total');
  const promises = [];
  for (let index = 0; index < LOOP_INDEX; index += 1) {
    promises.push(fetchWelcomePage(index));
  }
  await Promise.all(promises);
  console.timeEnd('total');
};
