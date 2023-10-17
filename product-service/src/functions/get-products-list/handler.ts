import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { formatJSONSuccessResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

async function getProductsList(_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const getProductsCommand = new ScanCommand({ TableName: 'products' });
    const getStocksCommand = new ScanCommand({ TableName: 'stocks' });

    const productsResponse = await docClient.send(getProductsCommand);
    const stocksResponse = await docClient.send(getStocksCommand);

    const productsWithoutStock = Boolean(productsResponse?.Items?.length) ? productsResponse.Items.map(item => unmarshall(item)) : [];
    const stocks = Boolean(stocksResponse?.Items?.length) ? stocksResponse.Items.map(item => unmarshall(item)) : [];

    const products = productsWithoutStock.map((product, i) => {
        const poductStock = stocks[i]?.id === product.id ? stocks[i] : stocks.find(stock => stock.id === product.id);
        const count = poductStock?.count ?? 0;
        return { ...product, count };
    });

    return formatJSONSuccessResponse({ products });
};

export const main = middyfy(getProductsList);
