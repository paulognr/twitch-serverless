import {Callback, Context} from "aws-lambda";
import {WebsocketAPIGatewayEvent} from "../app/websockets/types";
import {WebsocketClient} from "../app/websockets/websocket.client";

exports.onConnect = async (event: WebsocketAPIGatewayEvent, context: Context, callback: Callback) => {
    console.log("onConnect");
    const websocketClient = new WebsocketClient(event.requestContext);
    await websocketClient.connect();
    return callback(null, "Success");
};

exports.onDisconnect = async (event: WebsocketAPIGatewayEvent, context: Context, callback: Callback) => {
    console.log("onDisconnect")
    const websocketClient = new WebsocketClient(event.requestContext);
    await websocketClient.disconnect();
    return callback(null, "Success");
};