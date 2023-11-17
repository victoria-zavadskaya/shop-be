import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import { StatusCodes } from "http-status-codes";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: string) => {
    return {
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text' },
        statusCode: StatusCodes.OK,
        body: response,
    }
}
