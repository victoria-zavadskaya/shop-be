import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONErrorResponse, formatJSONSuccessResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { StatusCodes } from 'http-status-codes';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

async function getProductById(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const { id } = event.pathParameters;
    const command = new GetCommand({
        TableName: 'products',
        Key: { id }
    });
    
    const response = await docClient.send(command);
    const product = response.Item;

    if (Boolean(product)) {
        return formatJSONSuccessResponse({ product });
    }

    const errorCode = StatusCodes.NOT_FOUND;
    const errorMessage = `Product with id '${id}' is not found.`;

    return formatJSONErrorResponse(errorCode, errorMessage);
};

export const main = middyfy(getProductById);
