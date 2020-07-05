import {DynamoDB} from "aws-sdk";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";

export class DynamoDBClient {

    private dynamoDB: DynamoDB.DocumentClient;

    constructor() {
        this.dynamoDB = new DynamoDB.DocumentClient(process.env.IS_OFFLINE ? {
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        } : undefined);
    }

    async saveAll(items: Array<any>, tableName: string): Promise<void | DynamoDB.DocumentClient.BatchWriteItemOutput> {
        console.debug("DynamoDBClient.saveAll");
        const putRequests = new Array();

        items.forEach((entity) => {
            putRequests.push({
                PutRequest: {
                    Item: entity
                }
            });
        });

        const params = {RequestItems: {}};
        params.RequestItems[tableName] = putRequests;
        console.log("DynamoDBClient.saveAll - request: " + JSON.stringify(params));

        return this.dynamoDB.batchWrite(params)
            .promise()
            .then(dynamoDBPromiseResult => {
                const response = dynamoDBPromiseResult.$response;
                if (response.error) {
                    console.error(response.error);
                    throw new Error("Error save all");
                }
                return response.data;
            });
    }

    async save(item: any, tableName: string): Promise<void | DynamoDB.DocumentClient.PutItemOutput> {
        return this.dynamoDB
            .put({
                TableName: tableName,
                Item: item
            })
            .promise()
            .then(dynamoDBPromiseResult => {
                const response = dynamoDBPromiseResult.$response;
                if (response.error) {
                    console.error(response.error);
                    throw new Error("Error save");
                }
                return response.data;
            });
    }

    async query(params: DocumentClient.QueryInput): Promise<void | DynamoDB.DocumentClient.QueryOutput> {
        console.log("DynamoDBClient.query - request: " + JSON.stringify(params));

        return this.dynamoDB.query(params)
            .promise()
            .then(dynamoDBPromiseResult => {
                const response = dynamoDBPromiseResult.$response;
                if (response.error) {
                    console.log("Unable to query. Error:", JSON.stringify(response.error, null, 2));
                    throw new Error("Error query");
                }
                return response.data;
            });
    }

    async scan(tableName: string): Promise<void | DynamoDB.DocumentClient.ScanOutput> {
        return this.dynamoDB.scan({ TableName: tableName })
            .promise()
            .then(dynamoDBPromiseResult => {
                const response = dynamoDBPromiseResult.$response;
                if (response.error) {
                    console.log("Unable to scan. Error:", JSON.stringify(response.error, null, 2));
                    throw new Error("Error scan");
                }
                return response.data;
            });
    }

    async delete(key: any, tableName: string): Promise<void | DynamoDB.DocumentClient.DeleteItemOutput> {
        return this.dynamoDB.delete({ TableName: tableName, Key: key})
            .promise()
            .then(dynamoDBPromiseResult => {
                const response = dynamoDBPromiseResult.$response;
                if (response.error) {
                    console.log("Unable to delete. Error:", JSON.stringify(response.error, null, 2));
                    throw new Error("Error delete");
                }
                return response.data;
            });
    }
}