import { handlerPath } from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: '/import',
                cors: {
                    origin: '*',
                    headers: ['Authorization', 'Access-Control-Allow-Origin']
                },
                request: {
                    parameters: {
                        querystrings: {
                            name: true
                        }
                    } 
                },
                authorizer: process.env.AUTH_FUNCTION
            }
        },
    ],
};
