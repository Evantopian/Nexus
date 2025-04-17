import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as rds from "aws-cdk-lib/aws-rds";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

/* 
  Some Tasks completed on AWS Console (website, manually):
    1. Tested Lambda func to query MongoDB
    2. created AWS Systems manager string parameters for DB Credentials
    3. Added Inbound rules for db VPC 
    4. Added IAM permission to lambda func, main.js (AmazonSSMReadOnlyAccess)
    5. Created budget tracker for {EC2, VPC}
    6. Created VPC to connect Lambda function to db
    7. Changed Subnet/route settings to allow pgadmin db access
    8. Used API Gateway to expose lambda funcs to internet
    9. Configured backend Go code to deploy graphql api
    10. Troubleshooting API Gateway issues
    11. Used CloudWatch logs to troubleshoot issues
    12. Deployed api on API Gateway
*/

export class NexusDbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC for Lambda and rds
    const vpc = new ec2.Vpc(this, "NexusVpc", {
      maxAzs: 2,
      natGateways: 1
    });

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

    //get db port
    const dbPort = dbInstance.dbInstanceEndpointPort;
    //save it to ssm, just in case needed
    new ssm.StringParameter(this, "DBPort", {
      parameterName: "/nexus/db/port",
      stringValue: dbInstance.dbInstanceEndpointPort,
    })

    //get db endpoint
    const dbHost = dbInstance.dbInstanceEndpointAddress;
    //save it to ssm, just in case needed
    new ssm.StringParameter(this, "DBHostParameter", {
      parameterName: "/nexus/db/host",
      stringValue: dbHost,
    });

    new cdk.CfnOutput(this, "DBend", {
      value: dbInstance.dbInstanceEndpointAddress,
    });

    const apiLambda = new lambda.Function(this, "ApiNexusDb", {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset("services"),
      vpc,
      handler: "init.handler",
      environment: {
        DB_HOST: dbHost,
        DB_USER: dbUsername,
        DB_PORT: dbPort,
        DB_PASS: ""
      },
    });

    const queryLambda = new lambda.Function(this, "QueryLambda", {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset("services"),
      vpc,
      handler: "query.handler",
      environment: {
        DB_HOST: dbHost,
        DB_USER: dbUsername,
        DB_PORT: dbPort,
        DB_PASS: ""
      },
    });

    apiLambda.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMFullAccess")
    );
    
    queryLambda.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMFullAccess")
    );

  }
}
