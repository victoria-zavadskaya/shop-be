import type { AWS } from '@serverless/typescript';

import { importFileParser, importProductFile } from '@functions/index';

const serverlessConfiguration: AWS = {
    service: 'import-service',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild'],
    provider: {
        name: 'aws',
        runtime: 'nodejs18.x',
        stage: 'dev',
        region: 'eu-west-1',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: ['s3:ListBucket'],
                Resource: ['arn:aws:s3:::import-service-bucket-888'],
            },
            {
                Effect: 'Allow',
                Action: ['s3:*'],
                Resource: ['arn:aws:s3:::import-service-bucket-888/*'],
            }
        ]
    },
    functions: { importProductFile, importFileParser },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;
