// const { DynamoDB } = require('aws-sdk');
// const crypto = require('crypto');

exports.handler = async () => {
  const { DynamoDB } = require('aws-sdk');
  const crypto = require('crypto');

  const dynamodb = new DynamoDB.DocumentClient();
  const LOOP_INDEX = 10;
  const ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

  for (let index = 0; index < LOOP_INDEX; index += 1) {
    await dynamodb.put({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: crypto.randomBytes(20).toString('hex'),
        test: 'This is a test value',
        createdAt: new Date().toISOString(),
        ttl: new Date().getTime() + ONE_DAY_IN_MILLIS,
      },
      ConditionExpression: 'attribute_not_exists(id)',
    });
  }
}