import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONSuccessResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { PRODUCTS_MOCK as products } from 'src/mocks/products-mock';

function getProductsList(_event: APIGatewayProxyEvent): APIGatewayProxyResult {
    return formatJSONSuccessResponse({ products });
};

export const main = middyfy(getProductsList);
