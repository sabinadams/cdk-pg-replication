import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as cdk from "aws-cdk-lib";
import { SecretValue } from "aws-cdk-lib";
import { CdkResourceInitializer } from "./ckd-resource-initializer";
/*
  Still need to:
  - Create a PUBLICATION using a custom resource & a lambda function
*/
export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "vpc", {
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: "public-subnet-1",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    const securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc,
      description: "Security group for RDS instance.",
    });

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5432),
      "Allow access to RDS from anywhere"
    );

    const parameterGroup = new rds.ParameterGroup(this, "ParameterGroup", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14,
      }),
      parameters: {
        ["rds.logical_replication"]: "1",
        listen_addresses: "*",
      },
    });

    // 👇 create RDS instance
    const dbInstance = new rds.DatabaseInstance(this, "db-instance", {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14,
      }),
      parameterGroup: parameterGroup,
      credentials: {
        username: "postgres",
        password: SecretValue.unsafePlainText("postgres"),
      },
      securityGroups: [securityGroup],
      backupRetention: cdk.Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
      databaseName: "pulsedb",
      publiclyAccessible: true,
      port: 5432,
    });

    const result = new CdkResourceInitializer(this, "Resource", {
      host: dbInstance.instanceEndpoint.hostname,
    });

    new cdk.CfnOutput(this, "dbEndpoint", {
      value: dbInstance.instanceEndpoint.hostname,
    });
  }
}
