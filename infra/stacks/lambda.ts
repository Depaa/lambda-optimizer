import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Runtime, Function, Code, Architecture } from 'aws-cdk-lib/aws-lambda';
import { Effect, IRole, Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { BuildConfig } from '../lib/common/config.interface';
import { name } from '../lib/common/utils';
import { join } from 'path';

interface LambdaStackProps extends StackProps {
  dynamoDBTableArn: string;
}

export class LambdaStack extends Stack {

  constructor(scope: App, id: string, props: LambdaStackProps, buildConfig: BuildConfig) {
    super(scope, id, props);

    const baseEnv = {
      DYNAMODB_TABLE: props.dynamoDBTableArn,
    };

    const lambdaRoleDynamoDB = this.createLambdaRole(name(`${id}`), props, buildConfig);
    this.createOptimizedFunction(name(`${id}-optimized`), 'optimized', lambdaRoleDynamoDB, baseEnv);
    this.createFunction(name(`${id}-not-optimized`), 'not-optimized', lambdaRoleDynamoDB, baseEnv);
  }

  private createOptimizedFunction = (name: string, filename: string, role: IRole, environment?: { [key: string]: string; }): Function => {
    return new NodejsFunction(this, name,
      {
        memorySize: 1024,
        architecture: Architecture.ARM_64,
        timeout: Duration.seconds(5),
        runtime: Runtime.NODEJS_16_X,
        bundling: {
          minify: true,
          // externalModules: [' '] // modules not to be bundled
        },
        awsSdkConnectionReuse: true,


        functionName: name,
        handler: 'index.handler',
        projectRoot: join(__dirname, `../../src/lambdas/${filename}`),
        // entry: join(__dirname, `../../backend/src/lambdas/${filename}/index.js`),
        description: 'Optimed lambda function',
        environment,
        role,
      }
    );
  }

  private createFunction(name: string, filename: string, role: IRole, environment?: { [key: string]: string; }): Function {
    return new Function(this, name, {
      functionName: `${name}`,
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(30),
      code: Code.fromAsset(join(__dirname, `../../backend/src/lambdas/${filename}`)),
      handler: 'index.handler',
      role,
      architecture: Architecture.X86_64,
      environment,
    });
  }

  private createLambdaRole(name: string, props: LambdaStackProps, buildConfig: BuildConfig): Role {
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