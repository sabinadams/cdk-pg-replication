"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkResourceInitializer = void 0;
const lambda = require("aws-cdk-lib/aws-lambda");
const cdk = require("aws-cdk-lib");
const path = require("path");
const constructs_1 = require("constructs");
const crypto_1 = require("crypto");
const customResources = require("aws-cdk-lib/custom-resources");
class CdkResourceInitializer extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const fn = new lambda.SingletonFunction(this, "Singleton", {
            uuid: (0, crypto_1.randomUUID)(),
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
exports.CdkResourceInitializer = CdkResourceInitializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2tkLXJlc291cmNlLWluaXRpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL2NrZC1yZXNvdXJjZS1pbml0aWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBaUQ7QUFDakQsbUNBQW1DO0FBQ25DLDZCQUE2QjtBQUc3QiwyQ0FBdUM7QUFDdkMsbUNBQW9DO0FBQ3BDLGdFQUFnRTtBQUVoRSxNQUFhLHNCQUF1QixTQUFRLHNCQUFTO0lBRW5ELFlBQ0UsS0FBZ0IsRUFDaEIsRUFBVSxFQUNWLEtBRUM7UUFFRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDekQsSUFBSSxFQUFFLElBQUEsbUJBQVUsR0FBRTtZQUNsQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDakUsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUNsQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzlELGNBQWMsRUFBRSxFQUFFO1NBQ25CLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3hELFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWTtZQUNuQyxVQUFVLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2FBQ2pCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pELENBQUM7Q0FDRjtBQWhDRCx3REFnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcblxuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgcmFuZG9tVVVJRCB9IGZyb20gXCJjcnlwdG9cIjtcbmltcG9ydCAqIGFzIGN1c3RvbVJlc291cmNlcyBmcm9tIFwiYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlc1wiO1xuXG5leHBvcnQgY2xhc3MgQ2RrUmVzb3VyY2VJbml0aWFsaXplciBleHRlbmRzIENvbnN0cnVjdCB7XG4gIHB1YmxpYyByZWFkb25seSByZXNwb25zZTogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihcbiAgICBzY29wZTogQ29uc3RydWN0LFxuICAgIGlkOiBzdHJpbmcsXG4gICAgcHJvcHM6IHtcbiAgICAgIGhvc3Q6IHN0cmluZztcbiAgICB9XG4gICkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuU2luZ2xldG9uRnVuY3Rpb24odGhpcywgXCJTaW5nbGV0b25cIiwge1xuICAgICAgdXVpZDogcmFuZG9tVVVJRCgpLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vbGFtYmRhXCIpKSxcbiAgICAgIGhhbmRsZXI6IFwiaW5kZXguaGFuZGxlclwiLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzAwKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xOF9YLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgY3VzdG9tUmVzb3VyY2VzLlByb3ZpZGVyKHRoaXMsIFwiUHJvdmlkZXJcIiwge1xuICAgICAgb25FdmVudEhhbmRsZXI6IGZuLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgY2RrLkN1c3RvbVJlc291cmNlKHRoaXMsIFwiUmVzb3VyY2VcIiwge1xuICAgICAgc2VydmljZVRva2VuOiBwcm92aWRlci5zZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGhvc3Q6IHByb3BzLmhvc3QsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5yZXNwb25zZSA9IHJlc291cmNlLmdldEF0dChcIlJlc3BvbnNlXCIpLnRvU3RyaW5nKCk7XG4gIH1cbn1cbiJdfQ==