// NOTE: AWS_NODEJS_CONNECTION_REUSE_ENABLED is enable dy default, must be disabled
exports.handler = async () => {
  const { DynamoDBClient, PutCommand } = require('@aws-sdk/client-dynamodb');
  const crypto = require('crypto');

  const dynamodb = new DynamoDBClient();
  const LOOP_INDEX = 10;
  const ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

  for (let index = 0; index < LOOP_INDEX; index += 1) {
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
    await dynamodb.send(putCommand);
  }
}