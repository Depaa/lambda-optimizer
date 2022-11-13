const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const crypto = require('crypto');

// eslint-disable-next-line no-unused-vars
const dynamodb = new DynamoDBClient({ region: 'eu-central-1' });
const LOOP_INDEX = 10;

const fibonacci = (n) => {
  if (n < 2) return 1;
  return fibonacci(n - 2) + fibonacci(n - 1);
};

exports.handler = async () => {
  const promises = [];

  for (let index = 0; index < LOOP_INDEX; index += 1) {
    crypto.randomBytes(128).toString('hex');
    promises.push(new Promise((resolve) => { fibonacci(LOOP_INDEX * 100); resolve(); }));
  }
  await Promise.allSettled(promises);
};
