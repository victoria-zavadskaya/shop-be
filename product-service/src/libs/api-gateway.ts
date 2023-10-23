import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export function formatJSONSuccessResponse(response: any = ''): APIGatewayProxyResult {
    return {
        isBase64Encoded: true,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        statusCode: StatusCodes.OK,
        body: JSON.stringify(response),
    }
}

export function formatJSONErrorResponse(statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, body: string = ''): APIGatewayProxyResult {
    return {
        isBase64Encoded: true,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        statusCode,
        body,
    }
}
