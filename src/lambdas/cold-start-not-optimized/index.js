// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const { DynamoDB } = require('aws-sdk');
const https = require('https');

const URL = 'https://www.google.com/';
const LOOP_INDEX = 25;

const fibonacci = (n) => {
  if (n < 2) return 1;
  return fibonacci(n - 2) + fibonacci(n - 1);
};

const fetchWelcomePage = async (index) => new Promise((resolve, reject) => {
  https.get(URL, (res) => {
    console.debug(index, 'REQUEST');
    resolve(res.statusCode);
  }).on('error', (e) => {
    reject(Error(e));
  });
});

exports.handler = async () => {
  console.time('initDynamo');
  // eslint-disable-next-line no-unused-vars
  const dynamodb = new DynamoDB();
  console.timeEnd('initDynamo');

  console.time('fibonacci');
  fibonacci(LOOP_INDEX);
  console.timeEnd('fibonacci');

  console.time('total');
  for (let index = 0; index < LOOP_INDEX; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await fetchWelcomePage(index);
  }
  console.timeEnd('total');
};
