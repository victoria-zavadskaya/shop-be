import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import stocks from '../mocks/stocks-mock';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function main() {
    const requests = stocks.map((stock => ({ PutRequest: { Item: stock }})));

    const command = new BatchWriteCommand({ RequestItems: { 'stocks': requests } });

    await docClient.send(command).then(
        () => console.log('Stocks table is successfully updated'),
        (err) => console.log(`Error occured while updating Stocks table: ${err}`)
    );
}

main();
