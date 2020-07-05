import {ApiGatewayManagementApi} from 'aws-sdk';
import {DynamoDBClient} from "../aws/client/dynamodb.client";
import {RealtimeAPIGatewayEventRequestContext} from "./types";

export class WebsocketClient {

    readonly connectionId: string;
    readonly connectedAt: number;
    readonly dynamoDBClient: DynamoDBClient;

    private ws: ApiGatewayManagementApi;

    constructor(requestContext: void | RealtimeAPIGatewayEventRequestContext) {
        if (requestContext) {
            this.ws = new ApiGatewayManagementApi({
                apiVersion: '2018-11-29',
                endpoint: `https://${requestContext.domainName}/${requestContext.stage}`,
            });
            this.connectionId = requestContext.connectionId;
            this.connectedAt = requestContext.connectedAt;
        }

        this.dynamoDBClient = new DynamoDBClient();
    }

    send(msg: string | any, id?: string) {
        let parsed = typeof msg === 'string' ? msg : JSON.stringify(msg);

        console.log(`Sending ${parsed} to ${id || this.connectionId}`);

        return this.ws
            .postToConnection({
                ConnectionId: id || this.connectionId,
                Data: parsed,
            })
            .promise()
            .catch(err => {
                console.log(JSON.stringify(err));
            });
    }

    public async broadcast(msg: any): Promise<void> {
        console.log("broadcast - msg: " + msg);
        const response = await this.dynamoDBClient.scan(String(process.env.WEBSOCKET_CONNECTIONS_TABLE));
        console.dir(response);
        if (response && response.Items) {
            response.Items
                .forEach(connection => {
                    console.dir(connection);
                    this.ws = new ApiGatewayManagementApi({
                        apiVersion: '2018-11-29',
                        endpoint: process.env.IS_OFFLINE ? 'http://localhost:3001' : connection.endpoint.href,
                    });
                    this.ws.postToConnection({Data: msg, ConnectionId: connection.connectionId},
                        (err, data) => {
                            if (err) {
                                console.warn(err);
                            }
                        });
                });
        }
        return Promise.resolve(undefined);
    }

    public async connect(): Promise<any> {
        console.log("connect");
        const connection = {
            connectionId: this.connectionId,
            joinedAt: this.connectedAt,
            terminateAt: (this.connectedAt / 1000 + parseInt(String(process.env.SESSION_TTL))).toFixed(0),
            endpoint: this.ws.endpoint
        }
        console.dir(connection);
        return this.dynamoDBClient.save(connection, String(process.env.WEBSOCKET_CONNECTIONS_TABLE))
            .then(() => connection);
    }

    public async disconnect(): Promise<void> {
        const key = {
            connectionId: this.connectionId,
            joinedAt: this.connectedAt
        }
        return this.dynamoDBClient.delete(key, String(process.env.WEBSOCKET_CONNECTIONS_TABLE))
            .then(() => undefined);
    }
}