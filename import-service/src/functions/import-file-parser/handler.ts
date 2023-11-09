import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { S3Event } from 'aws-lambda';
import csvParser from 'csv-parser';

const s3Client = new S3Client({});
const sqsClient = new SQSClient({})

async function importFileParser(event: S3Event): Promise<void> {
    const s3 = event.Records[0].s3;
    const [key, bucket] = [s3.object.key, s3.bucket.name];

    const getObjectCommand = buildGetObjectCommand(bucket, key);
    const getCommandOutput = await s3Client.send(getObjectCommand);
    const documentData = getCommandOutput.Body;
    const parsedDocumentData = [];

    documentData
        .pipe(csvParser())
        .on('data', async (data) => {
            parsedDocumentData.push(data);
            const sendMessageCommand = buildSendMessageCommand(JSON.stringify(data));

            await sqsClient.send(sendMessageCommand);
        })
        .on('end', () => {
            const documentData = JSON.stringify(parsedDocumentData);
            return saveParsedDocument(documentData, bucket, key);
        });
};

async function saveParsedDocument(data: string, bucket: string, key: string): Promise<void> {
    const putOjectCommand = buildPutObjectCommand(bucket, key, data);
    const deleteObjectCommand = buildDeleteObjectCommand(bucket, key);

    try {
        await s3Client.send(putOjectCommand);

        await s3Client.send(deleteObjectCommand);
    } catch (error) {
        console.error(error);
    }
}

function buildSendMessageCommand(message: string): SendMessageCommand {
    return new SendMessageCommand({ QueueUrl: process.env.PRODUCTS_QUEUE_URL, MessageBody: message });
}

function buildGetObjectCommand(bucket: string, key: string): GetObjectCommand {
    return new GetObjectCommand({ Bucket: bucket, Key: key });
}

function buildPutObjectCommand(bucket: string, key: string, body: string): PutObjectCommand {
    return new PutObjectCommand({ Bucket: bucket, Key: key.replace('uploaded', 'parsed'), Body: body });
}

function buildDeleteObjectCommand(bucket: string, key: string): DeleteObjectCommand {
    return new DeleteObjectCommand({ Bucket: bucket, Key: key });
}

export const main = importFileParser;
