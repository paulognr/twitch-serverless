# Twitch Dashboard API

Simple RESTful API for twitch dashboard, built on top of the Serverless Framework for Node.js.

The API provides operations to search for game stream views and can run offline (local) or deployed on a serverless computing platform.

## Setup

Note: If you don’t already have Node on your machine, you’ll need to install it first. The latest LTS version of NodeJS is suggested.

Install the serverless CLI:

    npm install -g serverless

It's mandatory to set Twitch API keys, how to do it: Environment Variables section

## Starting locally

First step, install DynamoDB:

    sls dynamodb install

Then, the api can run offline by using a serverless framework command:

    sls offline start

## Going serverless

![Serverless][serverless]

The API use the Serverless Framework to package and deploy the app, along with the AWS infrastructure resources required in AWS Lambda functions.

AWS system credentials are required for using serverless with AWS, so check the 'Configure AWS Credentials' section below.

### Serverless configuration

The whole serverless configuration is done in the `serverless.yml` file.

##### Packaging

The `sls package` command packages the entire app and generate the CloudFormation templates into the `.serverless` directory and make it ready for deployment.

    serverless package

###### Options

option name | description | default value
----------- |:----------- |:-------------
`--stage` or `s` | The stage in your service that you want to deploy to. | `dev`
`--region` or `r` | The region in that stage that you want to deploy to. |`ca-central-1`

##### Deploying

The serverless framework can provision the AWS lambda functions, events, and infrastucture resources with the following command:

    serverless deploy

Use this method when you have updated any function, event or resource configuration in `serverless.yml` and you want to deploy the changes to AWS.

## Cloud Providers

### ![Amazon Web Services][aws]

The API leverage the AWS infrastructure to deploy the api as a lambda and stores data in a dynamodb table.

#### Configure AWS Credentials

You need to provide credentials to AWS so that only your account and its resources are accessed by the SDK. For more information about obtaining your account credentials, see [Getting Your Credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-your-credentials.html).

It is recommended to keep the AWS credentials data in a shared file named `credentials`. When the JavaScript SDK load, it will automatically searches this shared credentials file.

- The shared credentials file on Linux, Unix, and macOS: `~/.aws/credentials`
- The shared credentials file on Windows: `C:\Users\USER_NAME\.aws\credentials`

A basic credential file resemble the following example:

        [default]
        aws_access_key_id = <YOUR_ACCESS_KEY_ID>
        aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>

The `[default]` section heading specifies a default profile and associated values for credentials. By default, the SDK checks the `AWS_PROFILE` environment variable to determine which profile to use. If no `AWS_PROFILE` is set, the SDK uses the default profile credentials.

See [Loading node credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) for more information.

## Testing ![jest][jest]

The API use the delightful JavaScript Testing Framework Jest, which work with TypeScript projects. For the jest configuration, see the `jest.config.js` file.

### Run all tests

To run the api "test" script use:

    npm test

### Run a specific test

The option `--testNamePattern` or `-t` runs only tests with a name that matches the regex.
_Note: The regex is matched against the full name, which is a combination of the test name and all its surrounding suites._

    npm test -- -t <regex>

### Enable logs during tests

By default logs are suppressed when running unit tests, to enable them set the value of `transport.silent` at `false` in `test/setup.ts` file.

## Environment Variables

Environment variables are loaded from the `serverless.yml`.

Variable name | Description
------------- |:-------------
NODE_ENV | the environment on which the app is running, production or development
PORT | the http port on which the server is listening
CONTEXT_PATH | the base path for all operations in the api
AWS_REGION | the aws region to use when not deployed as a server. This variable is part of the AWS Lambda execution environment
TWITCH_CLIENT_ID |  the Twitch API client ID
TWITCH_CLIENT_SECRET | the Twitch API client secret
        
## AWS Architecture Diagram

![Architecture][aws-architecture]

[aws]: docs/img/amazon-web-services.svg
[serverless]: docs/img/serverless.svg
[jest]: docs/img/jest.svg
[aws-architecture]: docs/img/aws-architecture-diagram.png
