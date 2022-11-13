import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Runtime, Function, Code, Architecture } from 'aws-cdk-lib/aws-lambda';
import { Effect, IRole, Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Charset, NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { BuildConfig } from '../lib/common/config.interface';
import { name } from '../lib/common/utils';
import { join } from 'path';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

interface LambdaStackProps extends StackProps {
  dynamoDBTableName: string;
  dynamoDBTableArn: string;
}

enum LAMBDA_TYPE {
  OPTIMIZED,
  NOT_OPTIMIZED,
  COLD_START_OPTIMIZED,
  COLD_START_NOT_OPTIMIZED,
  CODE_OPTIMIZED,
  CODE_NOT_OPTIMIZED,
}

export class LambdaStack extends Stack {

  constructor(scope: App, id: string, props: LambdaStackProps, buildConfig: BuildConfig) {
    super(scope, id, props);

    const baseEnv = {
      DYNAMODB_TABLE: props.dynamoDBTableName,
    };

    const lambdaRoleDynamoDB = this.createLambdaRole(name(`${id}`), props, buildConfig);

    this.createFunction(name(`${id}-cold-start-not-optimized`), 'cold-start-not-optimized', lambdaRoleDynamoDB, LAMBDA_TYPE.COLD_START_NOT_OPTIMIZED, baseEnv);
    this.createBundleOptimizedFunction(name(`${id}-cold-start-optimized`), 'cold-start-optimized', lambdaRoleDynamoDB, LAMBDA_TYPE.COLD_START_OPTIMIZED, baseEnv);
    this.createBundleOptimizedFunction(name(`${id}-code-not-optimized`), 'code-not-optimized', lambdaRoleDynamoDB, LAMBDA_TYPE.CODE_NOT_OPTIMIZED, baseEnv);
    this.createBundleOptimizedFunction(name(`${id}-code-optimized`), 'code-optimized', lambdaRoleDynamoDB, LAMBDA_TYPE.CODE_OPTIMIZED, baseEnv);

    this.createFunction(name(`${id}-not-optimized`), 'not-optimized', lambdaRoleDynamoDB, LAMBDA_TYPE.NOT_OPTIMIZED, baseEnv);
    this.createBundleOptimizedFunction(name(`${id}-optimized`), 'optimized', lambdaRoleDynamoDB, LAMBDA_TYPE.OPTIMIZED, baseEnv);
  }

  private createBundleOptimizedFunction = (name: string, filename: string, role: IRole, type: LAMBDA_TYPE, environment?: { [key: string]: string; }): Function => {
    return new NodejsFunction(this, name,
      {
        memorySize: type === LAMBDA_TYPE.OPTIMIZED ? 128 /* TODO: change when power tuning */ : 128,
        architecture: type === LAMBDA_TYPE.OPTIMIZED ? Architecture.ARM_64 : Architecture.X86_64,
        timeout: Duration.seconds(5),
        runtime: Runtime.NODEJS_16_X,
        bundling: {
          minify: true,
          externalModules: ['aws-sdk', 'crypto'], // modules not to be bundled
          target: 'node16',
          keepNames: true,
        },
        // done to be fair because il will use JS_V3 hence the awsSdkConnectionReuse is defaulted to true
        // doing so we can test both scenario without AWS_NODEJS_CONNECTION_REUSE_ENABLED enabled
        awsSdkConnectionReuse: type !== LAMBDA_TYPE.COLD_START_OPTIMIZED,

        functionName: name,
        entry: join(__dirname, `../../src/lambdas/${filename}/index.js`),
        description: 'Optimized lambda function',
        logRetention: RetentionDays.ONE_MONTH,
        environment,
        role,
      }
    );
  }

  private createFunction = (name: string, filename: string, role: IRole, type: LAMBDA_TYPE, environment?: { [key: string]: string; }): Function => {
    return new Function(this, name, {
      memorySize: type !== LAMBDA_TYPE.NOT_OPTIMIZED ? 128 : 128 /* TODO: change when power tuning */,
      architecture: Architecture.X86_64,
      timeout: Duration.seconds(5),
      runtime: Runtime.NODEJS_16_X,

      functionName: `${name}`,
      handler: 'index.handler',
      code: Code.fromAsset(join(__dirname, `../../src/lambdas/${filename}`)),
      logRetention: RetentionDays.ONE_MONTH,
      environment,
      role,
    });
  }

  private createLambdaRole = (name: string, props: LambdaStackProps, buildConfig: BuildConfig): Role => {
    const lambdaRole = new Role(this, name, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaRole.attachInlinePolicy(new Policy(this, `${name}-lambda-basic-execution`, {
      policyName: `${name}-lambda-basic-execution`,
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
          ],
          resources: [
            '*',
          ]
        }),
      ]
    }));

    lambdaRole.attachInlinePolicy(new Policy(this, `${name}-dynamodb-table`, {
      policyName: `${name}-dynamodb-table`,
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'dynamodb:PutItem',
          ],
          resources: [
            props.dynamoDBTableArn,
          ]
        }),
      ]
    }));

    return lambdaRole;
  }
}