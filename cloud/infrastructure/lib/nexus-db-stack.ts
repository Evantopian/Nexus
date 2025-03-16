import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as rds from "aws-cdk-lib/aws-rds";
import * as lambda from "aws-cdk-lib/aws-lambda";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

/* 
  Tasks completed on AWS Console (website, manually):
    1. created AWS Systems manager string parameters for DB Credentials

*/

export class NexusDbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC for Lambda and rds
    const vpc = new ec2.Vpc(this, "NexusVpc", {
      maxAzs: 2,
      natGateways: 1
    });

    const dbHost = ssm.StringParameter.valueForStringParameter(this, "/nexus/db/host");
    const dbUsername = ssm.StringParameter.valueForStringParameter(this, "/nexus/db/username");
    const dbPassword = ssm.StringParameter.valueForSecureStringParameter(this, "/nexus/db/password", 1);

    const dbInstance = new rds.DatabaseInstance(this, "NexusPostgres", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_17_2,
      }),
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.MICRO
      ), //Free-tier
      credentials: rds.Credentials.fromPassword(dbUsername, cdk.SecretValue.unsafePlainText(dbPassword)),
      databaseName: "nexusdb",
      publiclyAccessible: true,

    });

    new cdk.CfnOutput(this, "DBend", {
      value: dbInstance.dbInstanceEndpointAddress,
    });

    const apiLambda = new lambda.Function(this, "ApiNexusDb", {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset("services"),
      handler: "main.handler",
      vpc,
      environment: {
        DB_HOST: dbHost,
        DB_USER: dbUsername,
        DB_PASS_PARAM: "/nexus/db/password"
      },
    });

  }
}
