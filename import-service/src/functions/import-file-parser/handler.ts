import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import csvParser from 'csv-parser';

const s3Client = new S3Client({});

async function importFileParser(event: S3Event): Promise<void> {
    const s3 = event.Records[0].s3;
    const [key, bucket] = [s3.object.key, s3.bucket.name];

    const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    const getCommandOutput = await s3Client.send(getCommand);
    const documentData = getCommandOutput.Body;
    const parsedDocumentData = [];

    documentData
        .pipe(csvParser())
        .on('data', (data) => {
            console.log(data);
            parsedDocumentData.push(data);
        })
        .on('end', () => {
            console.log(parsedDocumentData);
            return saveParsedDocument(JSON.stringify(parsedDocumentData), bucket, key);
        });
};

async function saveParsedDocument(documentData: string, bucket: string, key: string): Promise<void> {
    const putCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: key.replace('uploaded', 'parsed'),
        Body: documentData,
    });
    const putCommandOutput = await s3Client.send(putCommand);

    if (putCommandOutput.$metadata.httpStatusCode === StatusCodes.OK) {
        const deleteCommand = new DeleteObjectCommand({ Bucket: bucket, Key: key });
        await s3Client.send(deleteCommand);
    }
}

export const main = importFileParser;
