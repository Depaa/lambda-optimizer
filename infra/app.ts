#!/usr/bin/env node
import 'source-map-support/register';
import { App, Environment, StackProps } from 'aws-cdk-lib';
import { DynamoDBTableStack } from './stacks/dynamodb-table';
import { LambdaStack } from './stacks/lambda';
import { getConfig } from './lib/common/build-config';
import { BuildConfig } from './lib/common/config.interface';
import { Tags } from 'aws-cdk-lib';

const app = new App();

const buildConfig: BuildConfig = getConfig(app);
Tags.of(app).add('Environment', buildConfig.environment);
Tags.of(app).add('Project', buildConfig.project);

const env: Environment = { account: buildConfig.account, region: buildConfig.region }
const stackId = `${buildConfig.environment}-${buildConfig.project}`;
const baseProps: StackProps = { env }

const dynamoDBStackId = `${stackId}-dynamodb`;
const dynamoDBStack = new DynamoDBTableStack(app, dynamoDBStackId, {
  ...baseProps,
  stackName: dynamoDBStackId,
}, buildConfig);


const lambdaStackId = `${stackId}-lambda`;
const lambdaStack = new LambdaStack(app, lambdaStackId, {
  ...baseProps,
  stackName: lambdaStackId,
  dynamoDBTableArn: dynamoDBStack.dynamoDBTable.tableArn,
}, buildConfig);
