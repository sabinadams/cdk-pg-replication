import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as cdk from "aws-cdk-lib";
import { SecretValue } from "aws-cdk-lib";
import { Construct } from "constructs";

export class RdsStack extends Construct {
  dbInstance: rds.DatabaseInstance;
  constructor(
    scope: Construct,
    id: string,
    props: {
      vpc: ec2.Vpc;
      securityGroup: ec2.SecurityGroup[];
    }
  ) {
    super(scope, id);
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
    this.dbInstance = new rds.DatabaseInstance(this, "db-instance", {
      vpc: props.vpc,
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
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      securityGroups: props.securityGroup,
      backupRetention: cdk.Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
      databaseName: "pulsedb",
      publiclyAccessible: true,
      port: 5432,
    });

    new cdk.CfnOutput(this, "dbEndpoint", {
      value: `"postgresql://postgres:postgres@${this.dbInstance.instanceEndpoint.hostname}:5432/pulsedb"`,
    });
  }
}
