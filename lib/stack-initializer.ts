import * as rds from "aws-cdk-lib/aws-rds";
import * as cdk from "aws-cdk-lib";
import { LambdaStack } from "./lambda-initializer";
import { NetworkStack } from "./network-initializer";
import { RdsStack } from "./rds-initializer";

export class StackInitializer extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const network = new NetworkStack(this, "NetworkStack", null);
    const rds = new RdsStack(this, "RdsStack", {
      vpc: network.vpc,
      securityGroup: [network.securityGroup],
    });
    new LambdaStack(this, "LambdaStack", {
      host: rds.dbInstance.instanceEndpoint.hostname,
    });
  }
}
