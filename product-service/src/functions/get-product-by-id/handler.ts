import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONErrorResponse, formatJSONSuccessResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { PRODUCTS_MOCK as products } from 'src/mocks/products-mock';

function getProductById(event: APIGatewayProxyEvent): APIGatewayProxyResult {
    const { id } = event.pathParameters;
    const product = products.find(product => product.id === id);

    if (Boolean(product)) {
        return formatJSONSuccessResponse({ product });
    }

    const productNotFoundMessage = `Product with id '${id}' is not found.`;

    return formatJSONErrorResponse(productNotFoundMessage);
};

export const main = middyfy(getProductById);
