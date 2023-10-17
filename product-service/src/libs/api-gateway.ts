import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export function formatJSONSuccessResponse(response: any): APIGatewayProxyResult {
    return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        statusCode: StatusCodes.OK,
        body: JSON.stringify(response),
    }
}

export function formatJSONErrorResponse(message: string): APIGatewayProxyResult {
    return {
        headers: { 'Access-Control-Allow-Origin': '*' },
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify({ message }),
    }
}
