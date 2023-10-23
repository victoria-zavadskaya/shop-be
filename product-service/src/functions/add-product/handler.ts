import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONErrorResponse, formatJSONSuccessResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { Product } from 'src/models';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

async function addProduct(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    let body: any;
    try {
        body = JSON.parse(event.body); 
    } catch (e) {
        body = event.body;
    }
    const { title, price, description } = body;
    const product = { id: uuid(), title, price, description };

    const isValidData = validateProductData(product);

    if (!isValidData) {
        const errorCode = StatusCodes.BAD_REQUEST;
        const errorMessage = `Product data is not valid.`;
    
        return formatJSONErrorResponse(errorCode, errorMessage);
    }

    const command = new PutCommand({
        TableName: 'products',
        Item: product,
    });
    
    const response = await docClient.send(command);
    const isSuccessResponse = response.$metadata.httpStatusCode === StatusCodes.OK;

    return isSuccessResponse ? formatJSONSuccessResponse() : formatJSONErrorResponse();
};

function validateProductData(product: Product): boolean {
    const { title, description, price } = product;
    return Boolean(title) && Boolean(description) && Boolean(price);
}

export const main = middyfy(addProduct);
