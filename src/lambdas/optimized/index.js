const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const crypto = require('crypto');

// eslint-disable-next-line no-unused-vars
const dynamodb = new DynamoDBClient({ region: 'eu-central-1' });
const LOOP_INDEX = 29;

const fibonacci = async (n) => {
  if (n < 2) return 1;
  return fibonacci(n - 2) + fibonacci(n - 1);
};

exports.handler = async () => {
  console.time('total');
  const promises = [];

  for (let index = 0; index < LOOP_INDEX; index += 1) {
    console.time('duration');
    crypto.randomBytes(128).toString('hex');
    const promise = new Promise(() => { fibonacci(LOOP_INDEX); });
    promises.push(promise);
    console.timeEnd('duration');
    console.log('index', index);
  }
  // console.log(promises);
  await Promise.all(promises);
  console.timeEnd('total');
};
