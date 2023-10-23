import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import products from '../mocks/products-mock';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function main() {
    const requests = products.map((product => ({ PutRequest: { Item: product }})));

    const command = new BatchWriteCommand({ RequestItems: { 'products': requests } });

    await docClient.send(command).then(
        () => console.log('Products table is successfully updated'),
        (err) => console.log(`Error occured while updating Products table: ${err}`)
    );
}

main();
