const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const crypto = require('crypto');

const fibonacci = (n) => {
  if (n < 2) return 1;
  return fibonacci(n - 2) + fibonacci(n - 1);
};

exports.handler = async () => {
  // eslint-disable-next-line no-unused-vars
  const dynamodb = new DynamoDBClient();
  const LOOP_INDEX = 10;

  for (let index = 0; index < LOOP_INDEX; index += 1) {
    crypto.randomBytes(128).toString('hex');
    fibonacci(LOOP_INDEX * 100);
  }
};
