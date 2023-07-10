# Overview
This repository includes an [AWS CDK](https://aws.amazon.com/cdk/) project that provides an RDS instance that is configured to work with [Pulse](https://www.prisma.io/data-platform/pulse).

# Requirements (3)

## 1. An AWS account
If you do not already have an AWS account, you can create one [here](https://portal.aws.amazon.com/billing/signup#/start/email).

## 2. AWS CLI set up locally on your machine
Deploying the infrastructure requires an authenticated session on your local machine with AWS. Using the AWS CLI is an easy way to configure this.

### Install the CLI
If you do not already have the AWS CLI installed, you can install it by following the instructions [here](https://awscli.amazonaws.com/AWSCLIV2.pkg).

### Authenticate locally
Once installed, run the following command in your terminal and follow the prompts to authenticate with AWS.
```sh
aws configure
```

## 3. AWS CDK set up locally on your machine
The AWS CDK is what you the project uses to define the infrastructure to deploy. You will need to install and configure AWS CDK before deploying.

### Install the CDK
Run the following to install the `aws-cdk` CLI globally on your machine:

```sh
npm install -g aws-cdk
```

# Description

We recommend you review the code to ensure there aren't any surprises in what resources are configured (which may incur a charge on your AWS bill) and the security settings it applies. Here's a summary of what this project does:

* `lib/rds-intializer.ts`: creates an RDS Postgres instance with:
    * Version 14
    * Instance type t3.micro
    * Publicly accessible on port 5432
    * `postgres` admin user with password `postgres`. You may want to change this to a more secure password or use `fromGeneratedPassword()` [as shown in this example](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_rds-readme.html#login-credentials).
    * Uses VPC as defined below
* `lib/network-initializer.ts`: creates a VPC with ingress rule:
    * Allows access from any IP 
    * Only allows access on port 5432

# Deploying the infrastructure

To deploy the infrastructure, clone this repository and navigate into it via the terminal.

### Install `node_modules`
Run the following command to install all of the required packages:

```sh
npm i
```

### Configure the CDK

Run the following command, providing your AWS account's Account Number and preferred region.

```sh
cdk bootstrap aws://<ACCOUNT-NUMBER>/<REGION>
```

> **Note**
> For more detailed instructions on setting up the AWS CDK, see the documentation [here](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install).
> 

### Deploy the infrastructure
Run the following command to deploy the infrastructure:
```sh
cdk deploy
```

You will be prompted whether or not you actually want to deploy the infrastructure. Type `'y'` into the terminal and hit `Enter`.

> **Warning**
> The deployment will take a few minutes.

When the deployment is complete, you will see some output in the terminal containing the connection string to your new database. It should look something like:

```
Outputs:
CdkStarterStack.RdsStackdbEndpointA78C0C53 = "postgresql://postgres:postgres@cdkstarterstack-rdsstackdbinstance9f9e170f-amypehtdybzv.cghbgyrueus2.us-east-1.rds.amazonaws.com:5432/pulsedb"
Stack ARN:
arn:aws:cloudformation:us-east-1:322478124336:stack/CdkStarterStack/8acd2ad0-13a4-11ee-bfaa-12d32a109459
```

You need the connection string URL starting with `postgresql://`.

# Next steps
To quickly get up and running with Pulse follow these steps:
1. Create a new project in Cloud Projects if you don't already have one
2. Configure Pulse, providing the connection string from above and choosing a region close to your deployed infrastructure
3. Get an API key for your project
4. Clone the [pulse-starter](https://github.com/prisma/pulse-starter) repository and follow the steps in the README that walk you through the application-side of the setup

# Cleaning Up
When you are done testing, be sure to run the following command to remove all resources created by the AWS CDK if you no longer need them:

```sh
cdk destroy
```

You will be asked to confirm destroying the services. Type `'y'` and hit `Enter`. 

> **Warning**
> Leaving these resources running on your account may incur cost.
