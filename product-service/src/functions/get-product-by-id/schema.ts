export default {
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
    name: 'product'
} as const;
