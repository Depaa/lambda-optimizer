// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const { DynamoDB } = require('aws-sdk');
const crypto = require('crypto');

const fibonacci = (n) => {
  if (n < 2) return 1;
  return fibonacci(n - 2) + fibonacci(n - 1);
};

exports.handler = async () => {
  // eslint-disable-next-line no-unused-vars
  const dynamodb = new DynamoDB();
  const LOOP_INDEX = 29;

  for (let index = 0; index < LOOP_INDEX; index += 1) {
    crypto.randomBytes(128).toString('hex');
    fibonacci(LOOP_INDEX);
  }
};
