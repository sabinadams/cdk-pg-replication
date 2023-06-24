"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStarterStack = void 0;
const ec2 = require("aws-cdk-lib/aws-ec2");
const rds = require("aws-cdk-lib/aws-rds");
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ckd_resource_initializer_1 = require("./ckd-resource-initializer");
/*
  Still need to:
  - Create a PUBLICATION using a custom resource & a lambda function
*/
class CdkStarterStack extends cdk.Stack {
    constructor(scope, id, props) {
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
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432), "Allow access to RDS from anywhere");
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
                password: aws_cdk_lib_1.SecretValue.unsafePlainText("postgres"),
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
        const result = new ckd_resource_initializer_1.CdkResourceInitializer(this, "Resource", {
            host: dbInstance.instanceEndpoint.hostname,
        });
        new cdk.CfnOutput(this, "dbEndpoint", {
            value: dbInstance.instanceEndpoint.hostname,
        });
    }
}
exports.CdkStarterStack = CdkStarterStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmRzLXN0YWNrLWluaXRpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3Jkcy1zdGFjay1pbml0aWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUNuQyw2Q0FBMEM7QUFDMUMseUVBQW9FO0FBQ3BFOzs7RUFHRTtBQUNGLE1BQWEsZUFBZ0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUM1QyxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDbkMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUNoRCxNQUFNLEVBQUUsQ0FBQztZQUNULG1CQUFtQixFQUFFO2dCQUNuQjtvQkFDRSxJQUFJLEVBQUUsaUJBQWlCO29CQUN2QixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNO29CQUNqQyxRQUFRLEVBQUUsRUFBRTtpQkFDYjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDakUsR0FBRztZQUNILFdBQVcsRUFBRSxrQ0FBa0M7U0FDaEQsQ0FBQyxDQUFDO1FBRUgsYUFBYSxDQUFDLGNBQWMsQ0FDMUIsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFDbEIsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQ2xCLG1DQUFtQyxDQUNwQyxDQUFDO1FBRUYsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUNwRSxNQUFNLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQztnQkFDMUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNO2FBQzFDLENBQUM7WUFDRixVQUFVLEVBQUU7Z0JBQ1YsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLEdBQUc7Z0JBQ2hDLGdCQUFnQixFQUFFLEdBQUc7YUFDdEI7U0FDRixDQUFDLENBQUM7UUFFSCx5QkFBeUI7UUFDekIsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUMvRCxHQUFHO1lBQ0gsVUFBVSxFQUFFO2dCQUNWLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU07YUFDbEM7WUFDRCxNQUFNLEVBQUUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQztnQkFDMUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNO2FBQzFDLENBQUM7WUFDRixjQUFjLEVBQUUsY0FBYztZQUM5QixXQUFXLEVBQUU7Z0JBQ1gsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRSx5QkFBVyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUM7YUFDbEQ7WUFDRCxjQUFjLEVBQUUsQ0FBQyxhQUFhLENBQUM7WUFDL0IsZUFBZSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQyxzQkFBc0IsRUFBRSxJQUFJO1lBQzVCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsa0JBQWtCLEVBQUUsS0FBSztZQUN6QixZQUFZLEVBQUUsU0FBUztZQUN2QixrQkFBa0IsRUFBRSxJQUFJO1lBQ3hCLElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxpREFBc0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzFELElBQUksRUFBRSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsUUFBUTtTQUMzQyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNwQyxLQUFLLEVBQUUsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFFBQVE7U0FDNUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBckVELDBDQXFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjMlwiO1xuaW1wb3J0ICogYXMgcmRzIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtcmRzXCI7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBTZWNyZXRWYWx1ZSB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQ2RrUmVzb3VyY2VJbml0aWFsaXplciB9IGZyb20gXCIuL2NrZC1yZXNvdXJjZS1pbml0aWFsaXplclwiO1xuLypcbiAgU3RpbGwgbmVlZCB0bzpcbiAgLSBDcmVhdGUgYSBQVUJMSUNBVElPTiB1c2luZyBhIGN1c3RvbSByZXNvdXJjZSAmIGEgbGFtYmRhIGZ1bmN0aW9uXG4qL1xuZXhwb3J0IGNsYXNzIENka1N0YXJ0ZXJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCBcInZwY1wiLCB7XG4gICAgICBpcEFkZHJlc3NlczogZWMyLklwQWRkcmVzc2VzLmNpZHIoXCIxMC4wLjAuMC8xNlwiKSxcbiAgICAgIG1heEF6czogMyxcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwicHVibGljLXN1Ym5ldC0xXCIsXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIGNpZHJNYXNrOiAyNCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsIFwiU2VjdXJpdHlHcm91cFwiLCB7XG4gICAgICB2cGMsXG4gICAgICBkZXNjcmlwdGlvbjogXCJTZWN1cml0eSBncm91cCBmb3IgUkRTIGluc3RhbmNlLlwiLFxuICAgIH0pO1xuXG4gICAgc2VjdXJpdHlHcm91cC5hZGRJbmdyZXNzUnVsZShcbiAgICAgIGVjMi5QZWVyLmFueUlwdjQoKSxcbiAgICAgIGVjMi5Qb3J0LnRjcCg1NDMyKSxcbiAgICAgIFwiQWxsb3cgYWNjZXNzIHRvIFJEUyBmcm9tIGFueXdoZXJlXCJcbiAgICApO1xuXG4gICAgY29uc3QgcGFyYW1ldGVyR3JvdXAgPSBuZXcgcmRzLlBhcmFtZXRlckdyb3VwKHRoaXMsIFwiUGFyYW1ldGVyR3JvdXBcIiwge1xuICAgICAgZW5naW5lOiByZHMuRGF0YWJhc2VJbnN0YW5jZUVuZ2luZS5wb3N0Z3Jlcyh7XG4gICAgICAgIHZlcnNpb246IHJkcy5Qb3N0Z3Jlc0VuZ2luZVZlcnNpb24uVkVSXzE0LFxuICAgICAgfSksXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIFtcInJkcy5sb2dpY2FsX3JlcGxpY2F0aW9uXCJdOiBcIjFcIixcbiAgICAgICAgbGlzdGVuX2FkZHJlc3NlczogXCIqXCIsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8g8J+RhyBjcmVhdGUgUkRTIGluc3RhbmNlXG4gICAgY29uc3QgZGJJbnN0YW5jZSA9IG5ldyByZHMuRGF0YWJhc2VJbnN0YW5jZSh0aGlzLCBcImRiLWluc3RhbmNlXCIsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZwY1N1Ym5ldHM6IHtcbiAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgfSxcbiAgICAgIGVuZ2luZTogcmRzLkRhdGFiYXNlSW5zdGFuY2VFbmdpbmUucG9zdGdyZXMoe1xuICAgICAgICB2ZXJzaW9uOiByZHMuUG9zdGdyZXNFbmdpbmVWZXJzaW9uLlZFUl8xNCxcbiAgICAgIH0pLFxuICAgICAgcGFyYW1ldGVyR3JvdXA6IHBhcmFtZXRlckdyb3VwLFxuICAgICAgY3JlZGVudGlhbHM6IHtcbiAgICAgICAgdXNlcm5hbWU6IFwicG9zdGdyZXNcIixcbiAgICAgICAgcGFzc3dvcmQ6IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dChcInBvc3RncmVzXCIpLFxuICAgICAgfSxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbc2VjdXJpdHlHcm91cF0sXG4gICAgICBiYWNrdXBSZXRlbnRpb246IGNkay5EdXJhdGlvbi5kYXlzKDApLFxuICAgICAgZGVsZXRlQXV0b21hdGVkQmFja3VwczogdHJ1ZSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBkZWxldGlvblByb3RlY3Rpb246IGZhbHNlLFxuICAgICAgZGF0YWJhc2VOYW1lOiBcInB1bHNlZGJcIixcbiAgICAgIHB1YmxpY2x5QWNjZXNzaWJsZTogdHJ1ZSxcbiAgICAgIHBvcnQ6IDU0MzIsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgQ2RrUmVzb3VyY2VJbml0aWFsaXplcih0aGlzLCBcIlJlc291cmNlXCIsIHtcbiAgICAgIGhvc3Q6IGRiSW5zdGFuY2UuaW5zdGFuY2VFbmRwb2ludC5ob3N0bmFtZSxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiZGJFbmRwb2ludFwiLCB7XG4gICAgICB2YWx1ZTogZGJJbnN0YW5jZS5pbnN0YW5jZUVuZHBvaW50Lmhvc3RuYW1lLFxuICAgIH0pO1xuICB9XG59XG4iXX0=