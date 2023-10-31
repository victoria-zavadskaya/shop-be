
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const URL_EXPIRE_TIME = 3600;

async function importProductFile(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const s3Client = new S3Client({});
    const fileName = event.queryStringParameters.name;
    
    const command = new GetObjectCommand({
        Bucket: 'import-service-bucket-888',
        Key: `uploaded/${fileName}.csv`
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: URL_EXPIRE_TIME });

    return formatJSONResponse(url);
};

export const main = middyfy(importProductFile);
