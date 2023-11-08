import { SQSEvent } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Product } from 'src/models';

const snsClient = new SNSClient({});
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

function catalogBatchProcess(event: SQSEvent): void {
    event.Records.forEach(async (record) => {
        try {
            const parsedRecord = JSON.parse(record.body);
            const item: Product = { ...parsedRecord, count: Number(parsedRecord.count), price: Number(parsedRecord.price)};
            
            const createProductCommand = getCreateProductCommand(item);
            const publishMessageCommand = getPublishMessageCommand(item);

            await docClient.send(createProductCommand);

            await snsClient.send(publishMessageCommand);   
        } catch (error) {
            console.error(error);
        }
    });
};

function getCreateProductCommand(item: Product): PutCommand {
    return new PutCommand({ TableName: process.env.PRODUCTS_TABLE_NAME, Item: item });
}

function getPublishMessageCommand(item: Product): PublishCommand {
    return new PublishCommand({ Message: JSON.stringify(item), TopicArn: process.env.PRODUCTS_TOPIC_ARN })
}

export const main = catalogBatchProcess;
