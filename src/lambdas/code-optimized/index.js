const { DynamoDBClient, PutCommand } = require("@aws-sdk/client-dynamodb");
const crypto = require('crypto');

const dynamodb = new DynamoDBClient({ region: 'eu-central-1' });
const LOOP_INDEX = 10;
const ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

exports.handler = async (event) => {
  const promises = [];

  for (let index = 0; index < LOOP_INDEX; index++) {
    const putCommand = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: crypto.randomBytes(20).toString('hex'),
        test: 'This is a test value',
        createdAt: new Date().toISOString(),
        ttl: new Date().getTime() + ONE_DAY_IN_MILLIS,
      },
      ConditionExpression: 'attribute_not_exists(id)',
    });
    promises.push(dynamodb.send(putCommand));
  }
  await Promise.all(promises);
}