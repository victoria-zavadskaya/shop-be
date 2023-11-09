import type { AWS } from '@serverless/typescript';
import { addProduct, catalogBatchProcess, getProductById, getProductsList } from '@functions/index';

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
            PRODUCTS_QUEUE_URL: { Ref: 'createProductQueue' },
            PRODUCTS_TOPIC_ARN: { Ref: 'createProductTopic' },
            PRODUCTS_TABLE_NAME: 'products'
        },
        iamRoleStatements: [
            { 
                Effect: 'Allow',
                Action: 'sqs:*',
                Resource: [{ 'Fn::GetAtt': ['createProductQueue', 'Arn'] }]
            },
            { 
                Effect: 'Allow',
                Action: 'sns:*',
                Resource: { Ref: 'createProductTopic' }
            },
            { 
                Effect: 'Allow',
                Action: [
                    'dynamodb:DescribeTable',
                    'dynamodb:Query',
                    'dynamodb:Scan',
                    'dynamodb:GetItem',
                    'dynamodb:PutItem',
                    'dynamodb:UpdateItem',
                    'dynamodb:DeleteItem',
                    'dynamodb:BatchWriteItem'
                ],
                Resource: 'arn:aws:dynamodb:eu-west-1:024936853146:table/products'
            }
        ],
    },
    functions: {
        getProductsList,
        getProductById,
        addProduct,
        catalogBatchProcess 
    },
    resources: {
        Resources: {
            createProductQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'create-product-queue'
                }
            },
            createProductTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'create-product-topic'
                }
            },
            createAvailableProductSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: 'victoryzavadskaya@gmail.com',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'createProductTopic'
                    },
                    FilterPolicy: { count: [{'numeric': ['>', 0]}]},
                    FilterPolicyScope: 'MessageBody',
                },
            },
            createUnavailableProductSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: 'victoria_88888@outlook.com',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'createProductTopic'
                    },
                    FilterPolicy: { count: [{'numeric': ['=', 0]}]},
                    FilterPolicyScope: 'MessageBody',
                },
            }
        }
    },
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
