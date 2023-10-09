export default {
    definitions: {
        product: {
            type: 'object',
            properties: {
                count: {
                    type: 'number',
                },
                description: {
                    type: 'string',
                },
                id: {
                    type: 'string',
                },
                price: {
                    type: 'number',
                },
                title: {
                    type: 'string',
                },
            },
            required: ['count', 'description', 'id', 'price', 'title'],
        }
    },
    type: 'object',
    properties: {
        products: { 
            type: 'array',
            items: { '$ref': '#/definitions/product' },
        }
    },
    required: ['products'],
    name: 'products'
} as const;
