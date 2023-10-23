import type { AWS } from '@serverless/typescript';
import { addProduct, getProductById, getProductsList } from '@functions/index';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    frameworkVersion: '3',
    plugins: ['serverless-openapi-documentation', 'serverless-esbuild'],
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
    },
    functions: { getProductsList, getProductById, addProduct },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node18',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
        documentation: {
            version: '1',
            title: 'My API',
            description: 'This is my API',
            securitySchemes: {},
            security: {},
            models: {},
            typescriptApiPath: 'api.d.ts',
            tsconfigPath: 'tsconfig.json'
        }
    },
};

module.exports = serverlessConfiguration;
