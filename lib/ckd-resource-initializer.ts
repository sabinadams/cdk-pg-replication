import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";
import * as path from "path";

import * as fs from "fs";
import { Construct } from "constructs";
import { randomUUID } from "crypto";
import * as customResources from "aws-cdk-lib/custom-resources";

export class CdkResourceInitializer extends Construct {
  public readonly response: string;
  constructor(
    scope: Construct,
    id: string,
    props: {
      host: string;
    }
  ) {
    super(scope, id);

    const fn = new lambda.SingletonFunction(this, "Singleton", {
      uuid: randomUUID(),
      code: lambda.Code.fromAsset(path.resolve(__dirname, "../lambda")),
      handler: "index.handler",
      timeout: cdk.Duration.seconds(300),
      runtime: lambda.Runtime.NODEJS_18_X,
    });

    const provider = new customResources.Provider(this, "Provider", {
      onEventHandler: fn,
    });

    const resource = new cdk.CustomResource(this, "Resource", {
      serviceToken: provider.serviceToken,
      properties: {
        host: props.host,
      },
    });

    this.response = resource.getAtt("Response").toString();
  }
}
