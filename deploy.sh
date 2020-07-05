#! /bin/bash

npm install -g serverless
npm install webpack serverless-webpack serverless-dynamodb-local serverless-plugin-offline-dynamodb-stream serverless-offline
serverless deploy --package $CODEBUILD_SRC_DIR/.serverless