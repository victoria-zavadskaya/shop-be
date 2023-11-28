import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult, Context, Callback } from 'aws-lambda';

function basicAuthorizer(event: APIGatewayTokenAuthorizerEvent, _context: Context, cb: Callback): void {
    if (event.type !== 'TOKEN') {
        cb('Unauthorized');
    }

    try {
        const authorizationToken = event.authorizationToken;
        const resource = event.methodArn;
        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const creds = buff.toString('utf-8').split(':');
        const [userName, password] = [creds[0], creds[1]];
    
        const storedPassword = process.env[userName];
        const isPasswordValid = Boolean(storedPassword) && storedPassword === password;
        const effect = isPasswordValid ? 'Allow' : 'Deny';
        const policy = generatePolicy(encodedCreds, resource, effect)

        cb(null, policy);
    } catch (err) {
        cb(`Unauthorized: ${err.message}`);
    }
};

function generatePolicy(principalId: string, resource: string, effect: string): APIGatewayAuthorizerResult {
    const defaultVersion = '2012-10-17';
    const action = 'execute-api:Invoke';

    return {
        principalId,
        policyDocument: {
            Version: defaultVersion,
            Statement: [
                {
                    Action: action,
                    Effect: effect,
                    Resource: resource,
                }
            ],
        }
    }
}

export const main = basicAuthorizer;
