import { App, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { BuildConfig } from '../lib/common/config.interface';
import { name } from '../lib/common/utils';

export class DynamoDBTableStack extends Stack {
  public readonly dynamoDBTable: Table;

  constructor(scope: App, id: string, props: StackProps, buildConfig: BuildConfig) {
    super(scope, id, props);

    this.dynamoDBTable = this.createTable(name(`${id}`));
  }

  private createTable(name: string): Table {
    return new Table(this, name, {
      tableName: `${name}`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      timeToLiveAttribute: 'ttl',
    });
  }
}