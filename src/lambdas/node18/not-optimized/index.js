// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const LOOP_INDEX = 37;

const fibonacci = (n) => {
  if (n < 2) return 1;
  return fibonacci(n - 2) + fibonacci(n - 1);
};

const sleep = (time) => new Promise((resolve) => { setTimeout(resolve, time); });

exports.handler = async () => {
  console.time('initDynamo');
  // eslint-disable-next-line no-unused-vars
  const dynamodb = new DynamoDBClient();
  console.timeEnd('initDynamo');

  console.time('fibonacci');
  fibonacci(LOOP_INDEX);
  console.timeEnd('fibonacci');

  console.time('total');
  for (let index = 0; index < LOOP_INDEX; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(100);
  }
  console.timeEnd('total');
};
